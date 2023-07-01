import React from "react";
import { Place } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { PropertyCardProps } from "interfaces/property";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";

const PropertyCard = ({
  id,
  title,
  photo,
  location,
  price,
}: PropertyCardProps) => {
  return (
    <Card
      component={Link}
      to={`/properties/show/${id}`}
      sx={{
        width: "300px",
        padding: "10px",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 22px 45px 2px rgba(176, 176, 176, 0.15)",
        },
      }}
      elevation={0}>
      <CardMedia
        component="img"
        width="100%"
        height={218}
        image={photo}
        alt="card image"
        sx={{
          borderRadius: "10px",
        }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "10px",
          paddingX: "5px",
        }}>
        <Stack direction="column" gap={1}>
          <Typography>{title}</Typography>
          <Stack direction="row" gap={0.5} alignItems="flex-start">
            <Place
              sx={{
                fontSize: "18px",
                color: "#11142d",
                marginTop: 0.5,
              }}
            />
            <Typography fontSize={14} color="#808191">
              {location}
            </Typography>
          </Stack>
        </Stack>
        <Box
          px={1.5}
          py={0.5}
          borderRadius={1}
          bgcolor="#dadefa"
          height="fit-content">
          <Typography fontSize={12} fontWeight={600} color="#475be8">
            ${price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
