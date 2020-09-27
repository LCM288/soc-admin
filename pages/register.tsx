import React, { useState, useRef, useMemo } from "react";
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
import { Major } from "@/models/Major";
import { College } from "@/models/College";
import { Person } from "@/models/Person";
import majorsQuery from "../apollo/queries/major/majors.gql";
import collegesQuery from "../apollo/queries/college/colleges.gql";
import personQuery from "../apollo/queries/person/person.gql";
import newPersonMutation from "../apollo/queries/person/newPerson.gql";
import updatePersonMutation from "../apollo/queries/person/updatePerson.gql";

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

export default function Register({
  user,
}: {
  user: User | null;
}): React.ReactElement {
  const router = useRouter();
  const majorsQueryResult = useQuery(majorsQuery);
  const collegesQueryResult = useQuery(collegesQuery);
  const personQueryResult = useQuery(personQuery, {
    variables: { sid: user?.sid },
  });
  const [
    newPerson,
    { loading: newPersonMutationLoading, error: newPersonMutationError },
  ] = useMutation(newPersonMutation, {
    onCompleted: () => router.push("/"),
  });
  const [
    updatePerson,
    { loading: updatePersonMutationLoading, error: updatePersonMutationError },
  ] = useMutation(updatePersonMutation, {
    onCompleted: () => router.push("/"),
  });

  const [chineseName, setChineseName] = useState("");
  const [gender, setGender] = useState("None");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState(`${user?.sid}@link.cuhk.edu.hk`);
  const [phone, setPhone] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [majorCode, setMajorCode] = useState("");
  const [doEntry, setDoEntry] = useState("");
  const [doGrad, setDoGrad] = useState("");
  const personLoaded = useRef(false);

  const major = useMemo(() => {
    const foundMajor = majorsQueryResult.data?.majors.find(
      (m: Major) => m.code === majorCode
    );
    if (!foundMajor) {
      return { value: "", label: "" };
    }
    return {
      value: foundMajor.code,
      label: `${foundMajor.englishName} ${foundMajor.chineseName}`,
    };
  }, [majorsQueryResult, majorCode]);
  const college = useMemo(() => {
    const foundCollege = collegesQueryResult.data?.colleges.find(
      (c: College) => c.code === collegeCode
    );
    if (!foundCollege) {
      return { value: "", label: "" };
    }
    return {
      value: foundCollege.code,
      label: `${foundCollege.englishName} ${foundCollege.chineseName}`,
    };
  }, [collegesQueryResult, collegeCode]);
  const majors = useMemo(() => {
    return majorsQueryResult.data?.majors.map((a: Major) => ({
      value: a.code,
      label: `${a.englishName} ${a.chineseName}`,
    }));
  }, [majorsQueryResult]);
  const colleges = useMemo(() => {
    return collegesQueryResult.data?.colleges.map((a: College) => ({
      value: a.code,
      label: `${a.englishName} ${a.chineseName}`,
    }));
  }, [collegesQueryResult]);
  const termStart = useMemo(() => {
    const calcTermStart = (yearDiff: number) => {
      const year = yearDiff + DateTime.local().year;
      return [
        { value: `${year}-09-01`, label: `${year}-${year + 1} Term 1` },
        { value: `${year + 1}-01-01`, label: `${year}-${year + 1} Term 2` },
      ];
    };
    return [-8, -7, -6, -5, -4, -3, -2, -1, 0]
      .map((i) => calcTermStart(i))
      .flat();
  }, []);
  const termEnd = useMemo(() => {
    const calcTermEnd = (yearDiff: number) => {
      const year = yearDiff + DateTime.local().year;
      return [
        { value: `${year + 1}-01-01`, label: `${year}-${year + 1} Term 1` },
        { value: `${year + 1}-08-01`, label: `${year}-${year + 1} Term 2` },
      ];
    };
    return [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => calcTermEnd(i)).flat();
  }, []);

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
  if (!user) {
    return <div>no user</div>;
  }
  const { person } = personQueryResult.data as { person: Person };
  if (!personLoaded.current && person) {
    setChineseName(person.chineseName ?? "");
    setGender(person.gender ?? "None");
    setDob(person.dateOfBirth ?? "");
    setEmail(person.email ?? "");
    setPhone(person.phone ?? "");
    setCollegeCode((person.college as College).code);
    setMajorCode((person.major as Major).code);
    setDoEntry(person.dateOfEntry);
    setDoGrad(person.expectedGraduationDate);
  }
  personLoaded.current = true;
  const genders = [
    {
      value: "Male",
      label: "Male",
    },
    {
      value: "Female",
      label: "Female",
    },
    {
      value: "None",
      label: "Prefer not to say",
    },
  ];
  const validDate = (date: string) => {
    return /^\d{4}-\d{2}-\d{2}$/g.test(date) ? date : null;
  };
  const formSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const options = {
      variables: {
        sid: user.sid,
        englishName: user.name,
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
                <Input type="number" value={user?.sid} disabled required />
              </Control>
            </Field>
            <Field>
              <Label>English Name</Label>
              <Control>
                <Input value={user?.name} disabled required />
              </Control>
            </Field>
            <Field>
              <Label>Chinese Name</Label>
              <Control>
                <Input
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
                <div>
                  <ReactSelect
                    defaultValue={genders.find((g) => g.value === "None")}
                    value={genders.find((g) => g.value === gender)}
                    options={genders}
                    onChange={(input: { value: string }): void => {
                      setGender(input.value);
                    }}
                  />
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: "absolute", opacity: 0, height: 0 }}
                    value={gender}
                    onChange={() => {}}
                    required
                  />
                </div>
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
                  type="email"
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
                  type="tel"
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
                <div>
                  <ReactSelect
                    value={college}
                    options={colleges}
                    onChange={(input: {
                      value: string;
                      label: string;
                    }): void => {
                      setCollegeCode(input.value);
                    }}
                  />
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: "absolute", opacity: 0, height: 0 }}
                    value={collegeCode}
                    onChange={() => {}}
                    required
                  />
                </div>
              </Control>
            </Field>
            <Field>
              <Label>Major</Label>
              <div>
                <ReactSelect
                  value={major}
                  options={majors}
                  onChange={(input: { value: string; label: string }): void => {
                    setMajorCode(input.value);
                  }}
                />
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", opacity: 0, height: 0 }}
                  value={majorCode}
                  onChange={() => {}}
                  required
                />
              </div>
            </Field>
            <Field>
              <Label>Year of Entry</Label>
              <Control>
                <div>
                  <ReactSelect
                    value={termStart.find((term) => term.value === doEntry)}
                    options={termStart}
                    onChange={(input: {
                      value: string;
                      label: string;
                    }): void => {
                      setDoEntry(input.value);
                    }}
                  />
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: "absolute", opacity: 0, height: 0 }}
                    value={doEntry}
                    onChange={() => {}}
                    required
                  />
                </div>
              </Control>
            </Field>
            <Field>
              <Label>Expected Graduation Year</Label>
              <Control>
                <div>
                  <ReactSelect
                    value={termEnd.find((term) => term.value === doGrad)}
                    options={termEnd}
                    onChange={(input: {
                      value: string;
                      label: string;
                    }): void => {
                      setDoGrad(input.value);
                    }}
                  />
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: "absolute", opacity: 0, height: 0 }}
                    value={doGrad}
                    onChange={() => {}}
                    required
                  />
                </div>
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
