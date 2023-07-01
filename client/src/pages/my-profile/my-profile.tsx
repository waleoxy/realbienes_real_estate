import { BaseRecord, useGetIdentity, useOne } from "@refinedev/core";
import { Profile } from "components";
import { CredentialResponse } from "interfaces/google";

const MyProfile = () => {
  const { data: user } = useGetIdentity<any>();
  const { data, isLoading, isError } = useOne({
    resource: "users",
    id: user?.userid,
  });
  console.log("profile", data?.data);

  const myProfile: BaseRecord = data?.data ?? [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <Profile
      type="My"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allProperties}
    />
  );
};

export default MyProfile;
