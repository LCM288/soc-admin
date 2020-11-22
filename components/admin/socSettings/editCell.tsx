import dynamic from "next/dynamic";
import React, {
  useState,
  useRef,
  useCallback,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { SocSettingCellProps } from "utils/useSocSettingTable";
import { Form, Button, Content, Tile } from "react-bulma-components";
import ReactMarkdown from "react-markdown/with-html";
import { useMutation } from "@apollo/react-hooks";
import toast from "utils/toast";
import updateSocSettingMutation from "apollo/queries/socSetting/updateSocSetting.gql";
import socSettingsQuery from "apollo/queries/socSetting/socSettings.gql";
import socNameQuery from "apollo/queries/socSetting/socName.gql";
import { SimpleMDEEditorProps } from "react-simplemde-editor";

const SimpleMDE = dynamic<SimpleMDEEditorProps>(
  () => import("react-simplemde-editor")
);

const { Input, Field, Control } = Form;

interface Props extends SocSettingCellProps<Record<string, unknown>, string> {
  windowWidth: number;
  isExpanded?: boolean;
}

const EditCell = ({
  row,
  value,
  windowWidth,
  isExpanded = undefined,
}: Props): React.ReactElement => {
  const [updateSocSetting] = useMutation(updateSocSettingMutation, {
    refetchQueries: [{ query: socSettingsQuery }, { query: socNameQuery }],
  });

  const oldValue = useRef<string | undefined>();
  // https://github.com/RIP21/react-simplemde-editor/issues/79
  const [refreshState, dispatchForceRefresh] = useReducer(
    (state) => state + 1,
    0
  );
  const [editingValue, setEditingValue] = useState(
    row.state.editingValue as string
  );
  const [isSaving, setIsSaving] = useState(false);

  // set row state when editingValue changed
  useEffect(() => {
    row.setState({ editingValue });
  }, [row, editingValue]);

  // set editingValue to new remote value when remote value changed and editingValue not changed
  useEffect(() => {
    if (editingValue === oldValue.current && editingValue !== value) {
      setEditingValue(value);
    }
    oldValue.current = value;
  }, [editingValue, value, setEditingValue]);

  useEffect(() => {
    if (isExpanded) {
      dispatchForceRefresh();
    }
  }, [isExpanded]);

  const resetValue = useCallback(() => {
    dispatchForceRefresh();
    setEditingValue(value);
  }, [value, setEditingValue]);

  const updateValue = useCallback(() => {
    setIsSaving(true);
    updateSocSetting({
      variables: { key: row.values.key, value: editingValue },
    })
      .then((payload) => {
        if (!payload.data?.updateSocSetting.success) {
          throw new Error(
            payload.data?.updateSocSetting.message ?? "some error occurs"
          );
        }
        toast.success(payload.data.updateSocSetting.message, {
          position: toast.POSITION.TOP_LEFT,
        });
      })
      .catch((err) => {
        toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [updateSocSetting, row.values.key, editingValue]);

  const ResetButton = useCallback(
    () => (
      <Button color="danger" outlined onClick={resetValue}>
        Reset
      </Button>
    ),
    [resetValue]
  );

  const UpdateButton = useCallback(
    () => (
      <Button
        color="success"
        onClick={updateValue}
        loading={isSaving}
        disabled={value === editingValue}
      >
        Update
      </Button>
    ),
    [updateValue, isSaving, value, editingValue]
  );

  switch (row.values.type) {
    case "string":
      return (
        <>
          <Field className="has-addons">
            <Control className="is-expanded">
              <Input
                placeholder="No values set..."
                value={editingValue}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setEditingValue(event.target.value)
                }
              />
            </Control>
            {windowWidth > 768 && (
              <>
                <Control>
                  <ResetButton />
                </Control>
                <Control>
                  <UpdateButton />
                </Control>
              </>
            )}
          </Field>
          {windowWidth <= 768 && (
            <Button.Group position="right" className="mb-0">
              <ResetButton />
              <UpdateButton />
            </Button.Group>
          )}
        </>
      );
    case "richtext":
    default:
      return (
        <>
          <Tile
            kind="ancestor"
            className="mb-1"
            style={{ width: "100vw", maxWidth: "calc(100% - 1.5rem)" }}
          >
            <Tile
              kind="parent"
              style={{ maxWidth: windowWidth > 768 ? "50%" : "100%" }}
            >
              <Tile kind="child" style={{ left: "8px", position: "relative" }}>
                <SimpleMDE
                  id={row.values.key}
                  key={refreshState}
                  value={editingValue as string | undefined}
                  onChange={setEditingValue}
                  options={{
                    minHeight: "10rem",
                    maxHeight: "20rem",
                    previewClass: ["editor-preview", "content"],
                    toolbar: [
                      "bold",
                      "italic",
                      "strikethrough",
                      "|",
                      "heading-smaller",
                      "heading-bigger",
                      "|",
                      "code",
                      "quote",
                      "unordered-list",
                      "ordered-list",
                      "|",
                      "link",
                      "image",
                      "table",
                      "horizontal-rule",
                      "|",
                      "guide",
                    ],
                  }}
                />
              </Tile>
            </Tile>
            <Tile
              kind="parent"
              vertical
              style={{ maxWidth: windowWidth > 768 ? "50%" : "100%" }}
            >
              <Tile
                kind="child"
                className="box preview-content"
                style={{ left: "8px", position: "relative" }}
              >
                <Content>
                  <ReactMarkdown
                    source={editingValue as string | undefined}
                    escapeHtml={false}
                  />
                </Content>
              </Tile>
            </Tile>
          </Tile>
          <Button.Group position="right" className="mb-0">
            <ResetButton />
            <UpdateButton />
          </Button.Group>
        </>
      );
  }
};

EditCell.defaultProps = {
  isExpanded: undefined,
};

export default EditCell;
