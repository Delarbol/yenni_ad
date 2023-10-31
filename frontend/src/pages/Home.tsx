import { useState } from "react";
import Layout from "../components/Layout";
import logoBrand from "../assets/img/yennii.png";
import {
  FormContainer,
  ImgContainer,
  ResultContainer,
  YenButton,
  YenSelect,
  YenTextArea,
} from "../style";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

const { REACT_APP_ENDPOINT_BASE, REACT_APP_API_KEY } = process.env;

const client = axios.create({
  baseURL: `${REACT_APP_ENDPOINT_BASE}`,
  headers: {
    "x-api-key": `${REACT_APP_API_KEY}`,
  },
});

interface Data {
  prompt: string;
  imagenes: string[];
}

const Home = () => {
  const [success, setSuccess] = useState(true);
  const [data, setData] = useState({});

  const {
    register,
    handleSubmit,
    resetField,
    formState: { isValid },
  } = useForm();
  const onSubmit: SubmitHandler<any> = (data: any) => {
    console.log(data);
    sendData(data);
  };

  const sendData = (data: any) => {
    client.post("/images", data).then((r) => {
      console.log(r);
      setData(r.data);
      resetField("nodo");
      resetField("objetivo");
      resetField("descripcion");
      setSuccess(true);
    });
  };

  return (
    <Layout>
      <ImgContainer className="brand" src={logoBrand} alt="logo" />
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <YenSelect id="nodo" {...register("nodo")}>
            <option value="">Selecciona un nodo</option>
            <option
              value="seguidores
          "
            >
              Seguidores
            </option>
          </YenSelect>
          <YenSelect id="objetivo" {...register("objetivo")}>
            <option value="">Selecciona un objetivo</option>
            <option value="reach">Reach</option>
            <option value="awareness">Awareness</option>
            <option value="clicks">Clicks</option>
            <option value="consideracion">Consideracion</option>
          </YenSelect>
          <YenTextArea
            {...register("descripcion")}
            id="descripcion"
            placeholder="De que se trata la campaña"
          ></YenTextArea>
          <YenButton type="submit" disabled={!isValid}>
            Enviar
          </YenButton>
        </FormContainer>
      {success && <><ResultContainer>
          {(data as Data)?.imagenes?.map((img: string) => (
            <img key={img} src={img} alt="img" />
          ))}
        </ResultContainer>
        <h3>Prompt Recomendado: {(data as Data)?.prompt} </h3></>}
    </Layout>
  );
};

export default Home;
