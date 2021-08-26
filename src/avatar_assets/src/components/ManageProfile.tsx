import {
  ActionButton,
  ButtonGroup,
  Grid,
  Heading,
  Text,
} from "@adobe/react-spectrum";
import Cancel from "@spectrum-icons/workflow/Cancel";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import { remove, set } from "local-storage";
import * as React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";
import { AppContext } from "../App";
import { emptyProfile } from "../hooks";
import { compareProfiles } from "../utils";
import ProfileForm from "./ProfileForm";

const DetailsList = styled.dl`
  dd {
    margin-left: 0;
  }
`;

function ManageProfile() {
  const [isEditing, setIsEditing] = React.useState(false);
  const { actor, profile, isAuthenticated, updateProfile } =
    useContext(AppContext);
  const history = useHistory();

  const deleteProfile = async () => {
    if (
      confirm(
        "Are you sure you want to delete your profile? This will be permanent"
      )
    ) {
      const result = await actor?.delete();
      toast.success("Avatar successfully deleted");
      remove("profile");
      console.log(result);
      history.push("/");
    }
  };

  const compare = (updatedProfile: ProfileUpdate) => {
    return compareProfiles(profile, updatedProfile);
  };

  const submitCallback = (profile: ProfileUpdate) => {
    // Optimistically update
    updateProfile?.(profile);
    set("profile", JSON.stringify(profile));
    toast.success("Avatar updated!");
    setIsEditing(false);

    // Handle update async
    actor?.update(profile).then(async (profileUpdate) => {
      if ("ok" in profileUpdate) {
        const profileResponse = await actor.read();
        if ("ok" in profileResponse) {
          // Don't do anything if there is no difference.
          if (!compare(profileResponse.ok)) return;

          updateProfile?.(profileResponse.ok);
        } else {
          console.error(profileResponse.err);
          toast.error("Failed to read profile from IC");
        }
      } else {
        console.error(profileUpdate.err);
        toast.error("Failed to save update to IC");
      }
    });
  };

  const formProps = {
    submitCallback,
    actor,
    profile: profile ?? emptyProfile,
  };

  if (!profile) return null;

  const { name, displayName, givenName, location, about, familyName } =
    profile.bio;
  // Greet the user
  let fallbackDisplayName = name;
  if (givenName[0]) fallbackDisplayName = givenName;
  if (displayName[0]) fallbackDisplayName = displayName;

  return (
    <>
      {isEditing ? (
        <section key={String(isEditing)}>
          <Heading level={2}>Editing Profile</Heading>
          <ProfileForm {...formProps} />
          <ActionButton
            onPress={(e) => {
              setIsEditing(false);
            }}
          >
            <Cancel /> <Text>Cancel</Text>
          </ActionButton>
        </section>
      ) : (
        <section key={String(isEditing)}>
          <Heading level={2}>
            Welcome back
            {fallbackDisplayName[0] ? `, ${fallbackDisplayName[0]}` : ""}!
          </Heading>
          <DetailsList>
            <Grid columns="1fr 1fr" gap="1rem">
              <dd>Name:</dd>
              <dt>{name}</dt>
              <dd>Display Name:</dd>
              <dt>{displayName}</dt>
              <dd>First Name:</dd>
              <dt>{givenName}</dt>
              <dd>Last Name:</dd>
              <dt>{familyName}</dt>
              <dd>location:</dd>
              <dt>{location}</dt>
              <dd>About:</dd>
              <dt>{about}</dt>
            </Grid>
          </DetailsList>
          <ButtonGroup>
            <ActionButton onPress={() => setIsEditing(true)}>
              <Edit />
              <Text>Edit</Text>
            </ActionButton>
            <ActionButton onPress={deleteProfile}>
              <Delete /> <Text>Delete</Text>
            </ActionButton>
          </ButtonGroup>
        </section>
      )}
    </>
  );
}

export default React.memo(ManageProfile);
