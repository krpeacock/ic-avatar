import * as React from "react";
import { _SERVICE } from "../../../declarations/avatar/avatar.did";
import { Button, Text } from "@adobe/react-spectrum";
import ImageProfile from "@spectrum-icons/workflow/ImageProfile";
import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();

  return (
    <section>
      <h2>Welcome to IC Avatar!</h2>
      <p>
        This is an open-source, instructional application, built on the Internet
        Computer. You can create an Avatar on this site, which is a private
        profile that you will be able to use to link with other applications and
        choose what info you want to share.
      </p>
    </section>
  );
}

export default React.memo(Home);
