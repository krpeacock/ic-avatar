import {
  ActionButton,
  Form,
  Heading,
  TextArea,
  TextField,
} from "@adobe/react-spectrum";
import { ActorSubclass } from "@dfinity/agent";
import React from "react";
import { canisterId } from "../../../declarations/avatar";
import {
  Bio,
  Image,
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";
import { emptyProfile } from "../hooks";
import ProfileUpload from "./ProfileUpload";

interface Props {
  profile: ProfileUpdate;
  submitCallback: (profile: ProfileUpdate) => void;
  actor?: ActorSubclass<_SERVICE>;
}

class ProfileForm extends React.Component<Props> {
  state = { profile: emptyProfile };

  formRef = React.createRef();

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.profile) {
      this.setState({ profile: this.props.profile });
    }
  }

  handleChange(key: string, value: string) {
    const newState: any = { profile: this.state.profile };
    newState.profile.bio[key] = value ? [value] : [];
    this.setState(newState);
  }

  handleImage(image: Image) {
    const newState: any = { profile: this.state.profile };
    newState.profile.image = image ? [image] : [];
    this.setState(newState);
  }

  handleSubmit() {
    const { familyName, givenName } = this.state.profile.bio;
    const newProfile = Object.assign({}, this.state.profile);
    let name: string = [givenName[0], familyName[0]].join(" ");
    newProfile.bio.name = name ? [name] : [];

    this.props.submitCallback(newProfile);
  }

  render() {
    const { about, displayName, familyName, givenName, location } =
      this.state.profile.bio;

    const handleChange = this.handleChange.bind(this);
    const handleSubmit = this.handleSubmit.bind(this);
    const handleImage = this.handleImage.bind(this);
    return (
      <section>
        <Heading level={1}>Create a Profile</Heading>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <ProfileUpload
            onChange={handleImage}
            image={this.state.profile.image[0]}
          />
          <TextField
            label="First Name"
            name="givenName"
            autoComplete="given-name"
            value={givenName[0] || ""}
            onChange={(value) => handleChange("givenName", value)}
          />
          <TextField
            label="Last Name"
            name="familyName"
            autoComplete="family-name"
            value={familyName[0] || ""}
            onChange={(value) => handleChange("familyName", value)}
          />
          <TextField
            label="Profile Name"
            name="displayName"
            autoComplete="nickname"
            value={displayName[0] || ""}
            onChange={(value) => handleChange("displayName", value)}
          />
          <TextField
            label="Location"
            name="location"
            autoComplete="off"
            value={location[0] || ""}
            onChange={(value) => handleChange("location", value)}
          />
          <TextArea
            label="About"
            name="about"
            autoComplete="off"
            value={about[0] || ""}
            onChange={(value) => handleChange("about", value)}
          />
          <ActionButton type="button" onPress={handleSubmit}>
            Submit
          </ActionButton>
        </Form>
      </section>
    );
  }
}

export default ProfileForm;
