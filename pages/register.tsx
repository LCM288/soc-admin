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

import ChineseNameField from "components/register/chineseNameField";
import DOEntryField from "components/register/doEntryField";
import EnglishNameField from "components/register/englishNameField";
import PhoneField from "components/register/phoneField";
import CollegeField from "components/register/collegeField";
import DOGradField from "components/register/doGradField";
import GenderField from "components/register/genderField";
import SIDField from "components/register/sidField";
import DOBField from "components/register/dobField";
import EmailField from "components/register/emailField";
import MajorField from "components/register/majorField";
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
          setIsSubmitting(false);
        })
        .finally(() => setIsSubmitting(false));
    } else {
      newPerson(options)
        .catch((err) => {
          toast.danger(err.message, {
            position: toast.POSITION.TOP_LEFT,
          });
          setIsSubmitting(false);
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
            <SIDField sid={user?.sid} />
            <EnglishNameField englishName={user.name} isAdmin={false} />
            <ChineseNameField
              chineseName={chineseName}
              setChineseName={setChineseName}
            />
            <GenderField gender={gender} setGender={setGender} />
            <DOBField dob={dob} setDob={setDob} />
            <EmailField email={email} setEmail={setEmail} />
            <PhoneField phone={phone} setPhone={setPhone} />
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
    </div>
  );
}
