import React, { useCallback, useState } from "react";
import { Button } from "react-bulma-components";
import { useMutation } from "@apollo/react-hooks";
import AddRegistrationModal from "components/admin/registrations/addRegistrationModal";
import newPersonMutation from "apollo/queries/person/newPerson.gql";
import registrationsQuery from "apollo/queries/person/registrations.gql";
import { PersonCreationAttributes } from "@/models/Person";
import toast from "utils/toast";
import { StopClickDiv } from "utils/domEventHelpers";
import useClipped from "utils/useClipped";

const AddRegistration: React.FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  const [newPerson] = useMutation(newPersonMutation, {
    refetchQueries: [{ query: registrationsQuery }],
  });
  const [modalOpen, setModalOpen] = useState(false);
  useClipped(modalOpen);

  const promptAdd = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onAdd = useCallback(
    (person: PersonCreationAttributes) => {
      if (person.sid.length !== 10) {
        toast.danger("Incorrect sid");
        return;
      }
      setLoading(true);
      newPerson({ variables: person })
        .then((payload) => {
          if (!payload.data?.newPerson.success) {
            throw new Error(
              payload.data?.newPerson.message ?? "some error occurs"
            );
          }
          toast.success(payload.data.newPerson.message, {
            position: toast.POSITION.TOP_LEFT,
          });
          setModalOpen(false);
        })
        .catch((err) => {
          toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [newPerson]
  );

  return (
    <StopClickDiv>
      <>
        {modalOpen && (
          <AddRegistrationModal
            onSave={onAdd}
            onClose={() => {
              setModalOpen(false);
            }}
            loading={loading}
          />
        )}
        <Button color="primary" onClick={promptAdd}>
          Add registration
        </Button>
      </>
    </StopClickDiv>
  );
};

export default AddRegistration;
