import { BaseRecord, useOne } from "@refinedev/core";
import { Profile } from "components";
import { useParams } from "react-router-dom";

const AgentProfile = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useOne({
    resource: "users",
    id: id,
  });

  console.log("id: " + data?.data);

  const myProfile: BaseRecord = data?.data ?? [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <Profile
      type="Agent"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allProperties}
    />
  );
};

export default AgentProfile;
