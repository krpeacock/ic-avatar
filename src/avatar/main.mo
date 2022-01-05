import CertifiedData "mo:base/CertifiedData";
import Char "mo:base/Char";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Trie "mo:base/Trie";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Prim "mo:prim";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

actor Avatar {
    type Bio = {
        givenName: ?Text;
        familyName: ?Text;
        name: ?Text;
        displayName: ?Text;
        location: ?Text;
        about: ?Text;
    };

    type Profile = {
        bio: Bio;
        id: Principal;
        image: ?Image;
    };
    
    type ProfileUpdate = {
        bio: Bio;
        image: ?Image;
    };

    type Image = {
        fileName: Text;
        data: Blob;
        filetype: Text;
    };

    type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
    };
    type DeleteAssetArguments = {
        key: Text;
    };

    let AssetCanister = actor("renrk-eyaaa-aaaaa-aaada-cai") : actor {
        store: ({
            key: Text;
            content_type: Text;
            content_encoding: Text;
            content: Blob;
            sha256: ?Blob;
        }) -> async ();
        delete_asset: (DeleteAssetArguments) -> async ();
    };

    // Application state
    stable var profiles : Trie.Trie<Principal, Profile> = Trie.empty();

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
        let userProfile: Profile = {
            bio = profile.bio;
            image = profile.image;
            id = callerId;
        };

        let (newProfiles, existing) = Trie.put(
            profiles,           // Target trie
            key(callerId),      // Key
            Principal.equal,    // Equality checker
            userProfile
        );


        switch(profile.image){
            case null {};
            case (? v){
                var fileName = "/images/";
                fileName := Text.concat(fileName, Principal.toText(callerId));
                fileName := Text.concat(fileName, "/");
                fileName := Text.concat(fileName, v.fileName);
                let sha256 : ?Blob = null;

                let storeResult = await AssetCanister.store({
                    key = fileName;
                    content_type = v.filetype;
                    content_encoding = "identity";
                    content = v.data;
                    sha256 = sha256;
                });
            };
        };

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
    public shared(msg) func read () : async Result.Result<Profile, Error> {
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
        return Result.fromOption(result, #NotFound);
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
        let userProfile: Profile = {
            bio = profile.bio;
            image = profile.image;
            id = callerId;
        };

        let result = Trie.find(
            profiles,           //Target Trie
            key(callerId),     // Key
            Principal.equal           // Equality Checker
        );

        switch(profile.image){
            case null {};
            case (? v){
                var fileName = "/images/";
                fileName := Text.concat(fileName, Principal.toText(callerId));
                fileName := Text.concat(fileName, "/");
                fileName := Text.concat(fileName, v.fileName);
                let sha256 : ?Blob = null;

                // let deleteResult = await AssetCanister.delete_asset({key = fileName});

                let storeResult = await AssetCanister.store({
                    key = fileName;
                    content_type = v.filetype;
                    content_encoding = "identity";
                    content = v.data;
                    sha256 = sha256;
                });
            };
        };

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

                switch(v.image){
                    case null {};
                    case (? i){
                        var fileName = "/images/";
                        fileName := Text.concat(fileName, Principal.toText(callerId));
                        fileName := Text.concat(fileName, "/");
                        fileName := Text.concat(fileName, i.fileName);
                        let sha256 : ?Blob = null;

                        // let deleteResult = AssetCanister.delete_asset({key = fileName});
                    };
                };

                #ok(());
            };
        };
    };

    private func key(x : Principal) : Trie.Key<Principal> {
        return { key = x; hash = Principal.hash(x) }
    };
    private func keyText(x : Text) : Trie.Key<Text> {
        return { key = x; hash = Text.hash(x) }
    };
}
