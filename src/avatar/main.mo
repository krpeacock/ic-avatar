import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Trie "mo:base/Trie";
import Debug "mo:base/Debug";

actor Avatar {
    type Bio = {
        givenName: ?Text;
        familyName: ?Text;
        name: ?Text;
        displayName: ?Text;
        location: ?Text;
        about: ?Text;
    };

    type FullProfile = {
        bio: Bio;
        id: Principal;
        image: ?Text;
        wallets: Wallets;
        privacySettings: PrivacySettings;
        authorizations: [Authorization];
    };

    type Profile = {
        #full : FullProfile;
        #partial: {
            bio: Bio;
            id: Principal;
            image: ?Text;
            wallets: Wallets;
        }
    };
    
    type ProfileUpdate = {
        bio: Bio;
        image: ?Text;
        wallets: Wallets;
        privacySettings: PrivacySettings;
        authorizations: [Authorization];
    };

    type Wallets = {
        nns: ?Text;
        stoic: ?Text;
        plug: ?Text;
        cycles: ?Text;
    };

    type PrivacySettings = {
        bio: {
            givenName: Bool;
            familyName: Bool;
            name: Bool;
            displayName: Bool;
            location: Bool;
            about: Bool;
        };
        image: Bool;
        wallets: {
            nns: Bool;
            stoic: Bool;
            plug: Bool;
            cycles: Bool;
        };
    };

    let defaultPrivacySettings = {
        bio = {
            givenName =  false;
            familyName =  false;
            name =  false;
            displayName =  true;
            location =  false;
            about =  false;
        };
        image =  true;
        wallets =  {
            nns =  false;
            stoic =  false;
            plug =  false;
            cycles =  false;
        };
    };

    type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
    };

    // Authorized Principal Id with scope
    type Authorization = {
        id: Principal;
        scope: [AUTHORIZATION_SCOPE];
        url: Text;
    };

    type AUTHORIZATION_SCOPE = {
        #read_all;
        #read_bio;
        #read_image;
        #read_wallets;
    };

    // Application state
    stable var profiles : Trie.Trie<Principal, FullProfile> = Trie.empty();

    // Application interface

    // Create a profile
    public shared(msg) func create (profile: ProfileUpdate) : async Result.Result<(), Error> {
        // Get caller principal
        let callerId = msg.caller;

        // Reject AnonymousIdentity
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        // Associate user profile with their principal
        

        let userProfile : FullProfile = {
            bio = profile.bio;
            image = profile.image;
            id = callerId;
            wallets = profile.wallets;
            privacySettings = defaultPrivacySettings;
            authorizations = [];
        };

        let (newProfiles, existing) = Trie.put(
            profiles,           // Target trie
            key(callerId),      // Key
            Principal.equal,    // Equality checker
            userProfile
        );

        // If there is an original value, do not update
        switch(existing) {
            // If there are no matches, update profiles
            case null {
                profiles := newProfiles;
                #ok(());
            };
            // Matches pattern of type - opt Profile
            case (? v) {
                #err(#AlreadyExists);
            };
        };
    };

    // Read profile
    public query(msg) func read (id: Principal) : async Result.Result<Profile, Error> {
        // Get caller principal
        let callerId = msg.caller;

        let result = Trie.find(
            profiles,           //Target Trie
            key(id),      // Key
            Principal.equal     // Equality Checker
        );

        // Return full profile if call is from the owner
        if(callerId == id) {
            switch(result){
                case(null) {
                    return #err(#NotFound)
                };
                case(? v){
                    let bio = v.bio;
                    let profileResponse : Profile = #full {
                        id = v.id;
                        bio = v.bio;
                        image = v.image;
                        wallets = v.wallets;
                        authorizations = v.authorizations;
                        privacySettings = v.privacySettings;
                    };
                    return #ok(profileResponse)
                }
            }
        };

        // Otherwise, return public info and authorized scope
        switch(result){
            case(null){
                return #err(#NotFound);
            };
            case(? v){
                // Return a profile with all publically available fields
                var bio = {
                    givenName = ternary(v.privacySettings.bio.givenName, v.bio.givenName, null);
                    about = ternary(v.privacySettings.bio.about, v.bio.about, null);
                    displayName = ternary(v.privacySettings.bio.displayName, v.bio.displayName, null);
                    familyName = ternary(v.privacySettings.bio.familyName, v.bio.familyName, null);
                    location = ternary(v.privacySettings.bio.location, v.bio.location, null);
                    name = ternary(v.privacySettings.bio.name, v.bio.name, null);
                };
                var image = ternary(v.privacySettings.image, v.image, null);
                var wallets = {
                    nns =  ternary(v.privacySettings.wallets.nns, v.wallets.nns, null);
                    stoic =  ternary(v.privacySettings.wallets.stoic, v.wallets.stoic, null);
                    plug =  ternary(v.privacySettings.wallets.plug, v.wallets.plug, null);
                    cycles =  ternary(v.privacySettings.wallets.cycles, v.wallets.cycles, null);
                };
                        

                let authorization = Array.find<Authorization>(v.authorizations, func(a){ a.id == callerId });

                switch(authorization){
                    case(null){};
                    case(? a){
                        let scope = a.scope;
                        for(variant in Iter.fromArray(scope)) {
                            switch(variant){
                                case(#read_all){
                                    return #ok(#partial {
                                        id = v.id;
                                        bio = v.bio;
                                        wallets = v.wallets;
                                        image = v.image;
                                    });
                                };
                                case(#read_bio){
                                    bio := v.bio;
                                };
                                case(#read_image){
                                    image := image;
                                };
                                case(#read_wallets){
                                    wallets := wallets;
                                };
                            };
                            
                        };
                    };
                };
                  
                // Return 
                return #ok(#partial {
                    id = v.id;
                    bio = bio;
                    image = image;
                    wallets = wallets;
                })
            };
        };
   
    };

    func ternary<T>(condition: Bool, value: T, defaultValue: T ) : T {
        if(condition){
            return value;
        };
        return defaultValue;
    };

    // Update profile
    public shared(msg) func update (profile : ProfileUpdate) : async Result.Result<(), Error> {
        // Get caller principal
        let callerId = msg.caller;

        // Reject AnonymousIdentity
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        // Associate user profile with their principal
        let userProfile: FullProfile = {
            bio = profile.bio;
            image = profile.image;
            id = callerId;
            wallets = profile.wallets;
            privacySettings = profile.privacySettings;
            authorizations = profile.authorizations;
        };

        let result = Trie.find(
            profiles,           //Target Trie
            key(callerId),     // Key
            Principal.equal           // Equality Checker
        );

        switch (result){
            // Do not allow updates to profiles that haven't been created yet
            case null {
                #err(#NotFound)
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // Target trie
                    key(callerId),      // Key
                    Principal.equal,    // Equality checker
                    ?userProfile
                ).0;
                #ok(());
            };
        };
    };

    public shared(msg) func authorize(authorizations: [Authorization])  : async Result.Result<(), Error>{
        let callerId = msg.caller;

        // Reject AnonymousIdentity
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let result = Trie.find(
            profiles,           //Target Trie
            key(callerId),      // Key
            Principal.equal     // Equality Checker
        );

        switch(result){
            case(null) {
                return #err(#NotFound);
            };
            case(? v){
                let joinedAuthorizations = Array.append<Authorization>(v.authorizations, authorizations);

                Debug.print(Nat.toText(Iter.size(Array.vals(joinedAuthorizations))));

                let authorizedProfile: FullProfile = {
                    id= callerId;
                    bio= v.bio;
                    wallets= v.wallets;
                    image= v.image;
                    privacySettings= v.privacySettings;
                    authorizations=joinedAuthorizations;
                };

                profiles := Trie.replace(
                    profiles,           // Target trie
                    key(callerId),      // Key
                    Principal.equal,    // Equality checker
                    ?authorizedProfile
                ).0;
                return #ok(());
            }
        };
    };

    // Delete profile
    public shared(msg) func delete () : async Result.Result<(), Error> {
        // Get caller principal
        let callerId = msg.caller;

        // Reject AnonymousIdentity
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let result = Trie.find(
            profiles,           //Target Trie
            key(callerId),      // Key
            Principal.equal     // Equality Checker
        );

        switch (result){
            // Do not try to delete a profile that hasn't been created yet
            case null {
                #err(#NotFound);
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // Target trie
                    key(callerId),     // Key
                    Principal.equal,          // Equality checker
                    null
                ).0;
                #ok(());
            };
        };
    };

    private func key(x : Principal) : Trie.Key<Principal> {
        return { key = x; hash = Principal.hash(x) }
    };
}
