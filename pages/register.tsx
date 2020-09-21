import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { getUserAndRefreshToken } from "utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "@apollo/client";
import { Button, Form } from "react-bulma-components";

const { Input, Field, Control, Label } = Form;

export const getServerSideProps: GetServerSideProps<{
  user: User | null;
}> = async (ctx) => {
  const user = await getUserAndRefreshToken(ctx);
  if (!user) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/login");
  }
  return {
    props: { user }, // will be passed to the page component as props
  };
};

const query = gql`
  query Executive($sid: String!) {
    executive(sid: $sid) {
      id
      sid
      nickname
    }
  }
`;

export default function Register({
  user,
}: {
  user: User | null;
}): React.ReactElement {
  return (
    <div>
      <h1>Register</h1>
      {user?.name}
      {user?.sid}
      <Button color="primary">Push me</Button>
      <Field>
        <Label>Name</Label>
        <Control>
          <Input placeholder="Text input" />
        </Control>
      </Field>
    </div>
  );
}
