import { useState } from "react";
// import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router-dom";

import { Form } from "components";
import { FieldValues } from "react-hook-form";
import { useGetIdentity } from "@refinedev/core";

const CreateProperty = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();

  const [propertyImage, setPropertyimage] = useState({
    name: "",
    url: "",
  });

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();

  const handleImageChange = (file: File) => {
    const reader = (readFile: File) =>
      new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.readAsDataURL(readFile);
      });
    reader(file).then((result: string) =>
      setPropertyimage({
        name: file?.name,
        url: result,
      })
    );
  };

  const onFinishHandler = async (data: FieldValues) => {
    if (!propertyImage.name) {
      alert("Please select an image");
    }

    await onFinish({ ...data, photo: propertyImage.url, email: user.email });
  };

  return (
    <Form
      type="Create"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      propertyImage={propertyImage}
    />
  );
};

export default CreateProperty;
