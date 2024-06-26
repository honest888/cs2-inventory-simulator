/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS_Economy, CS_Item } from "@ianlucas/cs2-lib";
import { useState } from "react";
import { createFakeInventoryItem, getItemNameString } from "~/utils/inventory";
import { playSound } from "~/utils/sound";
import { useTranslate } from "./app-context";
import { ItemImage } from "./item-image";
import { ModalButton } from "./modal-button";
import { UnlockCaseAttribute } from "./unlock-case-attribute";
import { UseItemFooter } from "./use-item-footer";

export function UnlockCaseContainerUnlocked({
  caseItem,
  onClose,
  unlockedItem: { attributes, id, rarity }
}: {
  caseItem: CS_Item;
  onClose: () => void;
  unlockedItem: ReturnType<typeof CS_Economy.unlockCase>;
}) {
  const translate = useTranslate();
  const [revealScale, setRevealScale] = useState(0);

  function handleLoad() {
    setRevealScale(1);
    playSound(
      `case_awarded_${rarity as "common" | "uncommon" | "rare" | "mythical" | "legendary" | "ancient"}`
    );
  }

  const item = CS_Economy.getById(id);

  return (
    <div className="flex h-full w-full items-center justify-center text-center drop-shadow">
      <div>
        <div className="px-4 text-2xl">
          <span
            className="border-b-4 pb-2 font-display font-semibold leading-10 tracking-wider drop-shadow"
            style={{ borderColor: item.rarity }}
          >
            {getItemNameString(createFakeInventoryItem(item, attributes))}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <ItemImage className="h-8" item={caseItem} />
          <span>{getItemNameString(caseItem)}</span>
        </div>
        <ItemImage
          className="m-auto my-4 [transition:all_cubic-bezier(0.4,0,0.2,1)_250ms]"
          item={item}
          style={{ transform: `scale(${revealScale})` }}
          onLoad={handleLoad}
          wear={attributes.wear}
        />
        <UseItemFooter
          className="min-w-[1024px]"
          left={
            <div className="flex items-center gap-8">
              <UnlockCaseAttribute
                label={translate("CaseWear")}
                value={attributes.wear}
              />
              <UnlockCaseAttribute
                label={translate("CaseSeed")}
                value={attributes.seed}
              />
            </div>
          }
          right={
            <ModalButton
              children={translate("CaseClose")}
              onClick={onClose}
              variant="secondary"
            />
          }
        />
      </div>
    </div>
  );
}
