import { PropsWithRef } from "react";
import Header from "./Header";
import { MainContainer } from "../style";

const Layout = ({ children }: PropsWithRef<any> ) => {
  return(
    <>
      <Header />
      <MainContainer>
        {children}
      </MainContainer>
    </>
  )
}

export default Layout;
