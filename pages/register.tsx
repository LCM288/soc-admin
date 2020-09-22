import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { getUserAndRefreshToken } from "utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "@apollo/client";
import {
  Button,
  Form,
  Section,
  Container,
  Heading,
} from "react-bulma-components";

const { Input, Field, Control, Label, Select } = Form;

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
  const [chineseName, setChineseName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState(`${user?.sid}@link.cuhk.edu.hk`);
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const [yoEntry, setYoEntry] = useState("");
  const [yoGrad, setYoGrad] = useState("");
  return (
    <div>
      <Section>
        <Container>
          <Heading>Register</Heading>
          <Field>
            <Label>Student ID</Label>
            <Control>
              <Input type="number" value={user?.sid} disabled />
            </Control>
          </Field>
          <Field className="is-grouped">
            <Field>
              <Label>English Name</Label>
              <Control className="is-expanded">
                <Input value={user?.name} disabled />
              </Control>
            </Field>
            <Field>
              <Label>Chinese Name</Label>
              <Control className="is-expanded">
                <Input
                  placeholder="Text input"
                  value={chineseName}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setChineseName(event.target.value)}
                />
              </Control>
            </Field>
          </Field>
          <Field>
            <Label>Subject</Label>
            <Control>
              <Select
                value={gender}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setGender(event.target.value)
                }
              >
                <option value="M" selected={gender === "M"}>
                  M
                </option>
                <option value="F" selected={gender === "F"}>
                  F
                </option>
              </Select>
            </Control>
          </Field>
          <Field>
            <Label>Date of Birth</Label>
            <Control>
              <Input
                type="date"
                placeholder="Text input"
                value={dob}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setDob(event.target.value)
                }
              />
            </Control>
          </Field>
          <Field>
            <Label>Email</Label>
            <Control>
              <Input
                placeholder="Text input"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setEmail(event.target.value)
                }
              />
            </Control>
          </Field>
          <Field>
            <Label>Phone Number</Label>
            <Control>
              <Input
                value={phone}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setPhone(event.target.value)
                }
                size="20"
                pattern="(?:\+[0-9]{2,3}-[0-9]{1,15})|(?:[0-9]{8})"
              />
            </Control>
          </Field>
          <Field>
            <Label>College</Label>
            <Control>
              <Select
                value={college}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setCollege(event.target.value)
                }
              >
                <option value="M" selected={gender === "M"}>
                  M
                </option>
              </Select>
            </Control>
          </Field>
          <Field>
            <Label>Major</Label>
            <Control>
              <Select
                value={major}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setMajor(event.target.value)
                }
              >
                <option value="M" selected={gender === "M"}>
                  M
                </option>
              </Select>
            </Control>
          </Field>
          <Field>
            <Label>Year of Entry</Label>
            <Control>
              <Select
                value={yoEntry}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setYoEntry(event.target.value)
                }
              >
                <option value="M" selected={gender === "M"}>
                  M
                </option>
              </Select>
            </Control>
          </Field>
          <Field>
            <Label>Expected Graduation Year</Label>
            <Control>
              <Select
                value={yoGrad}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setYoGrad(event.target.value)
                }
              >
                <option value="M" selected={gender === "M"}>
                  M
                </option>
              </Select>
            </Control>
          </Field>
          <Button color="primary">Push me</Button>
        </Container>
      </Section>
    </div>
  );
}
