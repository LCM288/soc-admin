/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { useQuery, useMutation } from "@apollo/react-hooks";
import toast from "utils/toast";
import { Button, Section, Container, Heading } from "react-bulma-components";
import { Major } from "@/models/Major";
import { College } from "@/models/College";
import { Person } from "@/models/Person";

import DOEntryField from "components/register/doEntryField";
import TextField from "components/register/textField";
import CollegeField from "components/register/collegeField";
import DOGradField from "components/register/doGradField";
import GenderField from "components/register/genderField";
import DateField from "components/register/dateField";
import MajorField from "components/register/majorField";
import Loading from "components/loading";
import updatePersonMutation from "../apollo/queries/person/updatePerson.gql";
import newPersonMutation from "../apollo/queries/person/newPerson.gql";
import personQuery from "../apollo/queries/person/person.gql";
import collegesQuery from "../apollo/queries/college/colleges.gql";
import majorsQuery from "../apollo/queries/major/majors.gql";

export { getServerSideProps } from "utils/getServerSideProps";

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
  const [newPerson] = useMutation(newPersonMutation, {
    onCompleted: () => router.push("/"),
  });
  const [updatePerson] = useMutation(updatePersonMutation, {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: toast
  if (
    majorsQueryResult.error ||
    collegesQueryResult.error ||
    personQueryResult.error
  ) {
    const error =
      majorsQueryResult.error ||
      collegesQueryResult.error ||
      personQueryResult.error;
    toast.danger(error?.message, {
      position: toast.POSITION.TOP_LEFT,
    });
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
  const { person } = personQueryResult.data as { person?: Person };
  const setData = () => {
    setChineseName(person?.chineseName ?? "");
    setGender(person?.gender ?? "None");
    setDob(person?.dateOfBirth ?? "");
    setEmail(person?.email ?? `${user?.sid}@link.cuhk.edu.hk`);
    setPhone(person?.phone ?? "");
    setCollegeCode((person?.college as College | undefined)?.code ?? "");
    setMajorCode((person?.major as Major | undefined)?.code ?? "");
    setDoEntry(person?.dateOfEntry ?? "");
    setDoGrad(person?.expectedGraduationDate ?? "");
  };
  if (!personLoaded.current && person) {
    setData();
  }
  personLoaded.current = true;
  const validDate = (date: string) => {
    return /^\d{4}-\d{2}-\d{2}$/g.test(date) ? date : null;
  };
  const formSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      updatePerson(options)
        .catch((err) => {
          toast.danger(err.message, {
            position: toast.POSITION.TOP_LEFT,
          });
        })
        .finally(() => setIsSubmitting(false));
    } else {
      newPerson(options)
        .catch((err) => {
          toast.danger(err.message, {
            position: toast.POSITION.TOP_LEFT,
          });
        })
        .finally(() => setIsSubmitting(false));
    }
  };
  return (
    <div>
      <Section>
        <Container>
          <Heading>Register</Heading>
          <form onSubmit={(e) => formSubmit(e)}>
            <TextField value={user?.sid} label="Student ID" />
            <TextField
              value={user.name}
              label="English Name"
              placeholder="English Name as in CU Link Card"
            />
            <TextField
              value={chineseName}
              setValue={setChineseName}
              label="Chinese Name"
              placeholder="Chinese Name as in CU Link Card"
              editable
            />
            <GenderField gender={gender} setGender={setGender} />
            <DateField
              label="Date of Birth"
              dateValue={dob}
              setDateValue={setDob}
              editable
            />
            <TextField
              value={email}
              setValue={setEmail}
              label="Email"
              placeholder="Email address"
              type="email"
              editable
            />
            <TextField
              value={phone}
              setValue={setPhone}
              label="Phone Number"
              placeholder="Phone Number"
              type="tel"
              pattern="(?:\+[0-9]{2,3}-[0-9]{1,15})|(?:[0-9]{8})"
              editable
            />
            <CollegeField
              collegeCode={collegeCode}
              setCollegeCode={setCollegeCode}
            />
            <MajorField majorCode={majorCode} setMajorCode={setMajorCode} />
            <DOEntryField doEntry={doEntry} setDoEntry={setDoEntry} />
            <DOGradField doGrad={doGrad} setDoGrad={setDoGrad} />
            <Button.Group>
              <Button type="button" onClick={() => setData()}>
                Reset
              </Button>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                {person ? "Update" : "Register"}
              </Button>
            </Button.Group>
          </form>
        </Container>
      </Section>
      <Loading loading={isSubmitting} />
    </div>
  );
}
