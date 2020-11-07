import React, { useState, useCallback } from "react";
import { Modal, Button, Heading, Form } from "react-bulma-components";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateTime } from "luxon";
import YearMonthForm from "components/yearMonthForm";
import toast from "utils/toast";

interface Props {
  sid: string;
  englishName: string;
  onConfirm: (memberUntil: string | undefined) => void;
  onCancel: () => void;
}

const { Input, Field, Control, Label, Checkbox } = Form;

const ApproveModal = ({
  sid,
  englishName,
  onConfirm,
  onCancel,
}: Props): React.ReactElement => {
  const [calMonth, setCalMonth] = useState(new Date());
  const [memberUntil, setMemberUntil] = useState<string | undefined>();
  const [memberUntilGrad, setMemberUntilGrad] = useState(true);

  const onApprove = useCallback(() => {
    if (memberUntilGrad) {
      onConfirm(undefined);
    } else if (memberUntil) {
      onConfirm(memberUntil);
    } else {
      toast.danger(`Membership Expiration not Set!`);
    }
  }, [onConfirm, memberUntilGrad, memberUntil]);

  return (
    <Modal show closeOnEsc onClose={onCancel} className="modal-ovrflowing">
      <Modal.Content className="has-background-white box">
        <Heading className="has-text-centered" size={5}>
          {`You are going to approve ${englishName}'s (sid: ${sid}) membership.`}
        </Heading>
        <Field>
          <Label>Membership Expiration Date</Label>
          <Control>
            <DayPickerInput
              component={(props: unknown) => <Input {...props} />}
              inputProps={{ ref: null, disabled: memberUntilGrad }}
              classNames={{
                container: "",
                overlayWrapper: "DayPickerInput-OverlayWrapper",
                overlay: "DayPickerInput-Overlay",
              }}
              format="yyyy-MM-dd"
              formatDate={(date: Date) => DateTime.fromJSDate(date).toISODate()}
              parseDate={(str: string, format: string) => {
                const day = DateTime.fromFormat(str, format);
                return day.isValid ? day.toJSDate() : undefined;
              }}
              value={memberUntil}
              onDayChange={(date: Date) => {
                const dateTime = DateTime.fromJSDate(date);
                setMemberUntil(dateTime ? dateTime.toISODate() : "");
              }}
              placeholder="YYYY-MM-DD"
              dayPickerProps={{
                month: calMonth,
                captionElement: ({ date }: { date: Date }) => (
                  <YearMonthForm
                    date={date}
                    onChange={(month: Date) => setCalMonth(month)}
                  />
                ),
              }}
            />
          </Control>
        </Field>
        <Field>
          <Control>
            <Checkbox
              name="until graduation"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setMemberUntilGrad(event.target.checked);
              }}
              checked={memberUntilGrad}
            >
              <span className="ml-2">Until Graduation</span>
            </Checkbox>
          </Control>
        </Field>
        <div className="is-pulled-right buttons pt-4">
          <Button type="button" color="primary" onClick={onApprove}>
            Confirm
          </Button>
          <Button color="danger" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default ApproveModal;
