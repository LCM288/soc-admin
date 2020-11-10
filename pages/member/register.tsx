import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { useQuery, useMutation } from "@apollo/react-hooks";
import toast from "utils/toast";
import { Button, Section, Container, Heading } from "react-bulma-components";
import { Major } from "@/models/Major";
import { College } from "@/models/College";
import { PersonModelAttributes } from "@/models/Person";

import DOEntryField from "components/fields/doEntryField";
import TextField from "components/fields/textField";
import CollegeField from "components/fields/collegeField";
import DOGradField from "components/fields/doGradField";
import GenderField from "components/fields/genderField";
import DateField from "components/fields/dateField";
import MajorField from "components/fields/majorField";
import Loading from "components/loading";
import MemberLayout from "layouts/memberLayout";
import { PreventDefaultForm } from "utils/domEventHelpers";
import updatePersonMutation from "apollo/queries/person/updatePerson.gql";
import newPersonMutation from "apollo/queries/person/newPerson.gql";
import personQuery from "apollo/queries/person/person.gql";

export { getMemberPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const Register = ({ user }: { user: User | null }): React.ReactElement => {
  const router = useRouter();
  const personQueryResult = useQuery(personQuery, {
    variables: { sid: user?.sid },
  });
  const [newPerson] = useMutation(newPersonMutation);
  const [updatePerson] = useMutation(updatePersonMutation);

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

  const setData = useCallback(() => {
    const person =
      personQueryResult.data?.person ?? (null as PersonModelAttributes | null);
    setChineseName(person?.chineseName ?? "");
    setGender(person?.gender ?? "None");
    setDob(person?.dateOfBirth ?? "");
    setEmail(person?.email ?? `${user?.sid}@link.cuhk.edu.hk`);
    setPhone(person?.phone ?? "");
    setCollegeCode((person?.college as College | undefined)?.code ?? "");
    setMajorCode((person?.major as Major | undefined)?.code ?? "");
    setDoEntry(person?.dateOfEntry ?? "");
    setDoGrad(person?.expectedGraduationDate ?? "");
  }, [personQueryResult.data?.person, user?.sid]);

  useEffect(() => {
    if (!personLoaded.current && personQueryResult.data?.person) {
      setData();
      personLoaded.current = true;
    }
  }, [personQueryResult.data?.person, setData]);

  /* eslint-disable @typescript-eslint/no-shadow */
  const onSubmit = useCallback(
    ({
      chineseName,
      gender,
      dob,
      email,
      phone,
      collegeCode,
      majorCode,
      doEntry,
      doGrad,
    }) => {
      /* eslint-enable @typescript-eslint/no-shadow */
      const validDate = (date: string) => {
        return /^\d{4}-\d{2}-\d{2}$/g.test(date) ? date : null;
      };
      setIsSubmitting(true);
      const variables = {
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
      };
      const mutation = personQueryResult.data?.person
        ? updatePerson
        : newPerson;
      mutation({ variables })
        .then((payload) => {
          if (
            !payload.data?.newPerson?.success &&
            !payload.data?.updatePerson?.success
          ) {
            throw new Error(
              payload.data?.newPerson?.message ??
                payload.data?.updatePerson?.message ??
                "Some error occurred"
            );
          }
          toast.success(
            payload.data?.newPerson?.message ??
              payload.data?.updatePerson?.message ??
              "Successful Operation"
          );
          router.push("/member");
        })
        .catch((err) => {
          toast.danger(err.message, {
            position: toast.POSITION.TOP_LEFT,
          });
          setIsSubmitting(false);
        });
    },
    [user, personQueryResult.data?.person, newPerson, updatePerson, router]
  );

  const submitButtonText = useMemo(
    () => (personQueryResult.data?.person ? "Update" : "Register"),
    [personQueryResult.data?.person]
  );

  if (personQueryResult.error) {
    toast.danger(personQueryResult.error.message, {
      position: toast.POSITION.TOP_LEFT,
    });
  }

  if (!user) {
    return <></>;
  }
  return (
    <div>
      <Section>
        <Container>
          <Heading>Register</Heading>
          <PreventDefaultForm
            onSubmit={() =>
              onSubmit({
                chineseName,
                gender,
                dob,
                email,
                phone,
                collegeCode,
                majorCode,
                doEntry,
                doGrad,
              })
            }
          >
            <>
              <TextField
                value={user?.sid}
                pattern="^\d{10}$"
                label="Student ID"
              />
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
                <Button type="button" onClick={setData}>
                  Reset
                </Button>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {submitButtonText}
                </Button>
              </Button.Group>
            </>
          </PreventDefaultForm>
        </Container>
      </Section>
      <Loading loading={isSubmitting} />
    </div>
  );
};

Register.Layout = MemberLayout;

export default Register;
