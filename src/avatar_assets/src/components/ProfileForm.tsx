import {
  ActionButton,
  Form,
  Heading,
  TextArea,
  TextField,
} from "@adobe/react-spectrum";
import { ActorSubclass } from "@dfinity/agent";
import React from "react";
import {
  Bio,
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";
import { emptyProfile } from "../hooks";

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

  handleSubmit() {
    const { familyName, givenName } = this.state.profile.bio;
    const newProfile = Object.assign({}, this.state.profile);
    let name: string = [givenName, familyName].join(" ");
    newProfile.bio.name = name ? [name] : [];

    this.props.submitCallback(newProfile);
  }

  render() {
    const { about, displayName, familyName, givenName, location } =
      this.state.profile.bio;

    const handleChange = this.handleChange.bind(this);
    const handleSubmit = this.handleSubmit.bind(this);
    return (
      <section>
        <Heading level={1}>Create a Profile</Heading>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            label="First Name"
            name="givenName"
            value={givenName[0] || ""}
            onChange={(value) => handleChange("givenName", value)}
          />
          <TextField
            label="Last Name"
            name="familyName"
            value={familyName[0] || ""}
            onChange={(value) => handleChange("familyName", value)}
          />
          <TextField
            label="Profile Name"
            name="displayName"
            value={displayName[0] || ""}
            onChange={(value) => handleChange("displayName", value)}
          />
          <TextField
            label="Location"
            name="location"
            value={location[0] || ""}
            onChange={(value) => handleChange("location", value)}
          />
          <TextArea
            label="About"
            name="about"
            value={about[0] || ""}
            onChange={(value) => handleChange("about", value)}
          />
          <ActionButton type="submit">Submit</ActionButton>
        </Form>
      </section>
    );
  }
}

export default ProfileForm;
