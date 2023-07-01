import { Box, Stack, Typography } from "@mui/material";
import { useDelete, useGetIdentity, useShow } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChatBubbleOutlined,
  Delete,
  Edit,
  PhoneRounded,
  Place,
  Star,
} from "@mui/icons-material";
import { CustomButton } from "components";

function checkImage(url: any) {
  const img = new Image();
  img.src = url;
  return img.width !== 0 && img.height !== 0;
}

const PropertyDetail = ({}) => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const { id } = useParams();
  const { mutate } = useDelete();
  const { queryResult } = useShow();

  const { data, isLoading, isError } = queryResult;

  const propertydetail = data?.data ?? {};

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const isCurrentUser = user.email === propertydetail.creator[0].email;

  const handleDeleteProperty = () => {
    const response: boolean = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (response) {
      mutate(
        {
          resource: "properties",
          id: id as string,
        },
        {
          onSuccess: () => {
            navigate("/properties");
          },
        }
      );
    }
  };

  return (
    <Box
      minHeight="100vh"
      borderRadius="15px"
      padding="20px"
      bgcolor="#fcfcfc"
      width="100%">
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        Details
      </Typography>
      <Box
        mt="20px"
        display="flex"
        alignItems="center"
        flexDirection={{ xs: "column", lg: "row" }}
        gap={4}>
        <Box flex={1} maxWidth={764}>
          <img
            src={propertydetail?.photo}
            alt={propertydetail.title}
            height={546}
            style={{
              objectFit: "cover",
              borderRadius: "10px",
              width: "100%",
            }}
            className="property-details-img"
          />

          <Box mt="15px">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography
                fontSize={18}
                fontWeight={500}
                color="#11142d"
                textTransform="capitalize">
                {propertydetail.propertyType}
              </Typography>
              <Box>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={`star-${star}`}
                    sx={{
                      color: "#f2c94c",
                    }}
                  />
                ))}
              </Box>
            </Stack>

            <Stack
              mt={1}
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Box>
                <Typography
                  fontSize={20}
                  fontWeight={600}
                  color="#11142d"
                  textTransform="capitalize">
                  {propertydetail.title}
                </Typography>
                <Stack mt={0.5} direction="row" alignItems="center" gap={0.5}>
                  <Place
                    sx={{
                      color: "#808191",
                    }}
                  />
                  <Typography fontSize={14} color="#808191">
                    {propertydetail.location}
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  color="#11142d"
                  textTransform="capitalize">
                  Price
                </Typography>
                <Stack mt={0.5} direction="row" alignItems="center" gap={0.5}>
                  <Typography fontSize={20} fontWeight={600} color="#8081ff">
                    ${propertydetail.price}
                  </Typography>
                  <Typography fontSize={14} fontWeight={600} color="#808191">
                    for one day
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Box mt={4}>
              <Stack>
                <Typography fontSize={16} fontWeight={700} color="#808191">
                  Description
                </Typography>
                <Typography fontSize={13} fontWeight={500} color="#808191">
                  {propertydetail.description}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
        <Box
          width="100%"
          maxWidth={326}
          flex={1}
          display="flex"
          flexDirection="column"
          alignItems="center"
          border="1px solid #E8E8E8">
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            textAlign="center"
            padding={2}
            width="100%"
            alignItems="center">
            {/* avatar */}
            <img
              src={
                checkImage(propertydetail.creator[0].avatar)
                  ? propertydetail.creator[0].avatar
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
              }
              alt={user.email}
              style={{
                borderRadius: "28px",
                width: "58px",
                height: "58px",
                objectFit: "cover",
              }}
            />
            {/* username */}
            <Typography mt="15px" fontSize={18} fontWeight={700}>
              {propertydetail.creator[0].name}
            </Typography>
            {/* role */}
            <Typography fontSize={14} fontWeight={700} color="#808191">
              Agent
            </Typography>
            {/* place */}
            <Stack mt={1} direction="row">
              <Place
                sx={{
                  color: "#808191",
                }}
              />
              <Typography fontSize={14} letterSpacing="0.025em">
                {propertydetail.location}
              </Typography>
            </Stack>
            {/* no of props */}
            <Typography fontSize={16} fontWeight={500}>
              {propertydetail.creator[0].allProperties.length} Properties
            </Typography>
            {/* msg btn || call btn */}
            <Stack
              mt={2}
              direction="row"
              flexWrap="wrap"
              justifyContent="space-between"
              gap={2}
              alignItems="center">
              <CustomButton
                icon={!isCurrentUser ? <ChatBubbleOutlined /> : <Edit />}
                title={!isCurrentUser ? "Message" : "Edit"}
                backgroundColor="#475be8"
                color="#fcfcfc"
                handleClick={() => {
                  if (isCurrentUser) {
                    navigate(`/properties/edit/${propertydetail._id}`);
                  }
                }}
              />
              <CustomButton
                title={!isCurrentUser ? "Call" : "Delete"}
                backgroundColor={!isCurrentUser ? "#2ED480" : "#d42e2e"}
                color="#FCFCFC"
                fullWidth
                icon={!isCurrentUser ? <PhoneRounded /> : <Delete />}
                handleClick={() => {
                  if (isCurrentUser) handleDeleteProperty();
                }}
              />
            </Stack>
          </Box>
          {/* map */}
          <Stack>
            <img
              src="https://serpmedia.org/scigen/images/googlemaps-nyc-standard.png?crc=3787557525"
              width="100%"
              height={306}
              style={{ borderRadius: 10, objectFit: "cover" }}
            />
          </Stack>

          {/* button book now */}
          <Box width="100%" mt={2}>
            {" "}
            <CustomButton
              title="Book Now"
              backgroundColor="#475BE8"
              color="#FCFCFC"
              fullWidth
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyDetail;
