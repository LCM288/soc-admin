import React, { useState, useRef } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { getUserAndRefreshToken } from "utils/auth";
import { useQuery, useMutation } from "@apollo/react-hooks";
import ReactSelect from "react-select";
import { DateTime } from "luxon";
import {
  Button,
  Form,
  Section,
  Container,
  Heading,
} from "react-bulma-components";
import { Major } from "./Major";
import { College } from "./College";
import { Person } from "./Person";
import majorsQuery from "../apollo/queries/major/majors.gql";
import collegesQuery from "../apollo/queries/college/colleges.gql";
import personQuery from "../apollo/queries/person/person.gql";
import newPersonMutation from "../apollo/queries/person/newPerson.gql";
import updatePersonMutation from "../apollo/queries/person/updatePerson.gql";

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

export default function Register({
  user,
}: {
  user: User | null;
}): React.ReactElement {
  const majorsQueryResult = useQuery(majorsQuery);
  const collegesQueryResult = useQuery(collegesQuery);
  const personQueryResult = useQuery(personQuery, {
    variables: { sid: user?.sid },
  });
  const [
    newPerson,
    { loading: newPersonMutationLoading, error: newPersonMutationError },
  ] = useMutation(newPersonMutation);
  const [
    updatePerson,
    { loading: updatePersonMutationLoading, error: updatePersonMutationError },
  ] = useMutation(updatePersonMutation);

  const [chineseName, setChineseName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState(`${user?.sid}@link.cuhk.edu.hk`);
  const [phone, setPhone] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [majorCode, setMajorCode] = useState("");
  const [doEntry, setDoEntry] = useState("");
  const [doGrad, setDoGrad] = useState("");
  const personLoaded = useRef(false);

  if (
    majorsQueryResult.error ||
    collegesQueryResult.error ||
    personQueryResult.error
  ) {
    return <div>error</div>;
  }
  if (
    majorsQueryResult.loading ||
    collegesQueryResult.loading ||
    personQueryResult.loading
  ) {
    return <div>loading</div>;
  }
  const { majors } = majorsQueryResult.data as { majors: Major[] };
  const { colleges } = collegesQueryResult.data as { colleges: College[] };
  const { person } = personQueryResult.data as { person: Person };
  if (!personLoaded.current && person) {
    setChineseName(person?.chineseName ?? "");
    setGender(person?.gender ?? "");
    setDob(person?.dateOfBirth ?? "");
    setEmail(person?.email ?? "");
    setPhone(person?.phone ?? "");
    setCollegeCode(person?.college.code);
    setMajorCode(person?.major.code);
    setDoEntry(person?.dateOfEntry);
    setDoGrad(person?.expectedGraduationDate);
  }
  personLoaded.current = true;
  const getMajor = () => {
    const foundMajor = majors.find((m) => m.code === majorCode);
    if (!foundMajor) {
      return { value: "", label: "" };
    }
    return {
      value: foundMajor.code,
      label: `${foundMajor.englishName} ${foundMajor.chineseName}`,
    };
  };
  const getCollege = () => {
    const foundCollege = colleges.find((c) => c.code === collegeCode);
    if (!foundCollege) {
      return { value: "", label: "" };
    }
    return {
      value: foundCollege.code,
      label: `${foundCollege.englishName} ${foundCollege.chineseName}`,
    };
  };
  const mapCode = (arr: any[]) => {
    return arr.map((a) => ({
      value: a.code,
      label: `${a.englishName} ${a.chineseName}`,
    }));
  };
  const setDate = (date: string, values: Record<string, number>) => {
    const newDate = /^\d{4}-\d{2}-\d{2}$/g.test(date)
      ? DateTime.fromISO(date)
      : DateTime.local();
    return newDate.set(values).toISODate();
  };
  const validDate = (date: string) => {
    return /^\d{4}-\d{2}-\d{2}$/g.test(date) ? date : null;
  };
  const formSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const options = {
      variables: {
        sid: user?.sid,
        englishName: user?.name,
        chineseName,
        gender,
        dateOfBirth: validDate(dob),
        email,
        phone,
        college: collegeCode,
        major: majorCode,
        dateOfEntry: validDate(doEntry),
        expectedGraduationDate: validDate(doGrad),
      },
    };
    if (person) {
      updatePerson(options);
    } else {
      newPerson(options);
    }
  };
  return (
    <div>
      <Section>
        <Container>
          <Heading>Register</Heading>
          <form onSubmit={(e) => formSubmit(e)}>
            <Field>
              <Label>Student ID</Label>
              <Control>
                <Input type="number" value={user?.sid} disabled />
              </Control>
            </Field>
            <Field>
              <Label>English Name</Label>
              <Control>
                <Input value={user?.name} disabled />
              </Control>
            </Field>
            <Field>
              <Label>Chinese Name</Label>
              <Control>
                <Input
                  placeholder="Text input"
                  value={chineseName}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setChineseName(event.target.value)}
                />
              </Control>
            </Field>
            <Field>
              <Label>Gender</Label>
              <Control>
                <Select
                  value={gender || "DEFAULT"}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setGender(event.target.value)}
                >
                  <option value="DEFAULT" disabled>
                    Please Choose...
                  </option>
                  <option value="Male">M</option>
                  <option value="Female">F</option>
                  <option value="None">Prefer not to say</option>
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
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setDob(event.target.value)}
                />
              </Control>
            </Field>
            <Field>
              <Label>Email</Label>
              <Control>
                <Input
                  placeholder="Text input"
                  value={email}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setEmail(event.target.value)}
                />
              </Control>
            </Field>
            <Field>
              <Label>Phone Number</Label>
              <Control>
                <Input
                  value={phone}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setPhone(event.target.value)}
                  pattern="(?:\+[0-9]{2,3}-[0-9]{1,15})|(?:[0-9]{8})"
                />
              </Control>
            </Field>
            <Field>
              <Label>College</Label>
              <Control>
                <ReactSelect
                  value={getCollege()}
                  options={mapCode(colleges)}
                  onChange={(input: { value: string }): void => {
                    setCollegeCode(input.value);
                  }}
                />
              </Control>
            </Field>
            <Field>
              <Label>Major</Label>
              <ReactSelect
                value={getMajor()}
                options={mapCode(majors)}
                onChange={(input: { value: string }): void => {
                  setMajorCode(input.value);
                }}
              />
            </Field>
            <Field>
              <Label>Year of Entry</Label>
              <Control>
                <Select
                  className="mr-3"
                  value={DateTime.fromISO(doEntry).year}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => {
                    setDoEntry(
                      setDate(doEntry, {
                        year: parseInt(event?.target?.value, 10),
                      })
                    );
                  }}
                >
                  {[-8, -7, -6, -5, -4, -3, -2, -1, 0]
                    .map((i) => i + DateTime.local().year)
                    .map((y) => (
                      <option value={y} key={y}>
                        {y}
                      </option>
                    ))}
                </Select>
                <Select
                  value={DateTime.fromISO(doEntry).month || "DEFAULT"}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void =>
                    setDoEntry(
                      setDate(doEntry, {
                        month: parseInt(event?.target?.value, 10),
                        day: 1,
                      })
                    )
                  }
                >
                  <option value="DEFAULT" disabled>
                    Please Choose...
                  </option>
                  <option value="9">Term 1</option>
                  <option value="1">Term 2</option>
                </Select>
              </Control>
            </Field>
            <Field>
              <Label>Expected Graduation Year</Label>
              <Control>
                <Select
                  className="mr-3"
                  value={DateTime.fromISO(doGrad).year}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => {
                    setDoGrad(
                      setDate(doGrad, {
                        year: parseInt(event?.target?.value, 10),
                      })
                    );
                  }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8]
                    .map((i) => i + DateTime.local().year)
                    .map((y) => (
                      <option value={y} key={y}>
                        {y}
                      </option>
                    ))}
                </Select>
                <Select
                  value={DateTime.fromISO(doGrad).month || "DEFAULT"}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void =>
                    setDoGrad(
                      setDate(doGrad, {
                        month: parseInt(event?.target?.value, 10),
                        day: 31,
                      })
                    )
                  }
                >
                  <option value="DEFAULT" disabled>
                    Please Choose...
                  </option>
                  <option value="12">Term 1</option>
                  <option value="7">Term 2</option>
                </Select>
              </Control>
            </Field>
            <Button color="primary" type="submit">
              {person ? "Update" : "Register"}
            </Button>
          </form>
          {(newPersonMutationLoading || updatePersonMutationLoading) && (
            <p>Loading...</p>
          )}
          {(newPersonMutationError || updatePersonMutationError) && (
            <p>Error :( Please try again</p>
          )}
        </Container>
      </Section>
    </div>
  );
}
