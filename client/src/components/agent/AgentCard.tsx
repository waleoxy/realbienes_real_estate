import { EmailOutlined, LocationCity, Phone, Place } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { useGetIdentity } from "@refinedev/core";
import { AgentCardProp, InfoBarProps } from "interfaces/agent";
import { CredentialResponse } from "interfaces/google";
import { Link } from "react-router-dom";

const InfoBar = ({ icon, name }: InfoBarProps) => {
  return (
    <Stack
      flex={1}
      minWidth={{ xs: "100%", sm: 300 }}
      gap={1.5}
      direction="row">
      {icon}
      <Typography fontSize={14} color="#898191">
        {name}
      </Typography>
    </Stack>
  );
};

const AgentCard = ({
  id,
  name,
  email,
  avatar,
  noOfProperties,
}: AgentCardProp) => {
  const { data: currentUser } = useGetIdentity<CredentialResponse>();

  const generateLink = () => {
    if (currentUser?.email === email) return "/my-profile";
    return `show/${id}`;
  };

  return (
    <Box
      component={Link}
      to={generateLink()}
      width="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "flex" },
        gap: "20px",
        padding: "20px",
        "&:hover": {
          boxShadow: "0 22px 45px 2px rgba(176,176,176,0.1)",
        },
      }}>
      <img
        src={avatar}
        alt="user"
        width={90}
        height={90}
        style={{
          borderRadius: 8,
          objectFit: "cover",
        }}
      />
      <Stack
        direction="column"
        justifyContent="space-between"
        flex={1}
        gap={{ xs: 4, sm: 2 }}>
        <Stack gap={2} direction="row" flexWrap="wrap" alignItems="center">
          <Typography fontSize={22} fontWeight={600} color="#11142d">
            {name}
          </Typography>
          <Typography fontSize={14} color="#808191">
            Real Estate Agent
          </Typography>
        </Stack>
        <Stack
          gap={2}
          direction="row"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center">
          <InfoBar
            icon={
              <EmailOutlined
                sx={{
                  color: "#808191",
                }}
              />
            }
            name={email}
          />
          <InfoBar
            icon={
              <Place
                sx={{
                  color: "#808191",
                }}
              />
            }
            name="Ikeja-lagos"
          />
          <InfoBar
            icon={
              <Phone
                sx={{
                  color: "#808191",
                }}
              />
            }
            name="08045646366"
          />
          <InfoBar
            icon={
              <LocationCity
                sx={{
                  color: "#808191",
                }}
              />
            }
            name={` ${noOfProperties} Properties`}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default AgentCard;
