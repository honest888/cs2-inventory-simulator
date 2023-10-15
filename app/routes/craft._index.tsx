import { faLongArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "@remix-run/react";
import { CS_Item, CS_Team } from "cslib";
import { useState } from "react";
import { CSItemEditor, CSItemEditorAttributes } from "~/components/cs-item-editor";
import CSItemPicker from "~/components/cs-item-picker";
import { Modal } from "~/components/modal";
import { useRootContext } from "~/components/root-context";

export default function Craft() {
  const navigate = useNavigate();
  const [csItem, setCSItem] = useState<CS_Item>();
  const { setInventory } = useRootContext();

  function handleSubmit(attributes: CSItemEditorAttributes) {
    if (csItem !== undefined) {
      setInventory(inventory =>
        inventory.add({
          id: csItem.id,
          ...attributes
        })
      );
      return navigate("/");
    }
  }

  return (
    <Modal className="w-[512px]">
      <div className="font-bold px-4 py-2 select-none flex items-center justify-between">
        <span>Craft Item</span>
        <div className="flex items-center gap-8">
          {csItem !== undefined && (
            <button
              className="flex items-center gap-1 text-neutral-200 cursor-default hover:bg-black/30 px-2 rounded"
              onClick={() => setCSItem(undefined)}
            >
              <FontAwesomeIcon icon={faLongArrowLeft} />
              Reset
            </button>
          )}
          <Link to="/">
            <FontAwesomeIcon
              icon={faXmark}
              className="h-4 opacity-50 hover:opacity-100"
            />
          </Link>
        </div>
      </div>
      {csItem === undefined
        ? <CSItemPicker onPickItem={setCSItem} />
        : <CSItemEditor csItem={csItem} onSubmit={handleSubmit} />}
    </Modal>
  );
}
