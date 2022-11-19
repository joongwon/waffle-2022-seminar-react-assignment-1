import { FormEventHandler, useCallback, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  emptyToU,
  formatPrice,
  priceToNum,
  uToEmpty,
} from "../../lib/formatting";
import { displayType, MenuType } from "../../lib/types";
import { ButtonContainer } from "../ButtonContainer";
import { Form, InputWithLabel } from "../Form";
import styles from "./index.module.css";
import { useSessionContext } from "../../contexts/SessionContext";
import { apiCreateMenu } from "../../lib/api";
import { toast } from "react-toastify";
import { RedirectWithMessage } from "../../lib/hooks";
import { axiosErrorHandler } from "../../lib/error";

function useMenuCreatePageLogic() {
  const { withToken } = useSessionContext();
  const [editedMenu, setEditedMenu] = useState({
    price: null as number | null,
    type: null as MenuType | null,
    name: "",
    description: undefined as string | undefined,
    image: undefined as string | undefined,
  });
  const navigate = useNavigate();
  const submitMenu = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      const { name, price, type, image, description } = editedMenu;
      if (!type || !name || !price) {
        toast.warning("메뉴의 타입, 이름, 가격을 지정해주세요");
        return;
      }
      withToken((token) =>
        apiCreateMenu({ name, price, type, image, description }, token)
      )
        .then((newMenu) => {
          if (newMenu.canceled) return;
          toast.success("새 메뉴를 생성하였습니다");
          navigate(`/menus/${newMenu.payload.data.id}`);
        })
        .catch(axiosErrorHandler("새 메뉴를 생성할 수 없습니다"));
    },
    [editedMenu, navigate, withToken]
  );
  return { submitMenu, editedMenu, setEditedMenu };
}

export default function MenuCreatePage() {
  const { me, loading } = useSessionContext();
  const id = useId();
  const { submitMenu, editedMenu, setEditedMenu } = useMenuCreatePageLogic();
  return !loading && !me ? (
    <RedirectWithMessage
      message="메뉴를 생성하려면 로그인하세요"
      to="/auth/login"
    />
  ) : (
    <div className={styles["container"]}>
      <Form className={styles["form"]} onSubmit={submitMenu}>
        <h2>메뉴 추가</h2>
        <InputWithLabel
          value={editedMenu}
          label="이름"
          name="name"
          setValue={setEditedMenu}
          placeholder="맛있는와플"
          required
        />
        <label htmlFor={id}>종류</label>
        <select
          onChange={(e) =>
            setEditedMenu({
              ...editedMenu,
              type: e.target.value === "" ? null : (e.target.value as MenuType),
            })
          }
          value={editedMenu.type ?? ""}
          required
        >
          <option value="" disabled>
            메뉴의 종류를 선택하세요
          </option>
          {Object.values(MenuType).map((v) => (
            <option value={v} key={v}>
              {displayType(v as MenuType)}
            </option>
          ))}
        </select>
        <InputWithLabel
          value={editedMenu}
          label="가격"
          name="price"
          setValue={setEditedMenu}
          stringToProp={(s) => {
            return s !== "" ? priceToNum(s) ?? editedMenu.price : null;
          }}
          propToString={(p) => (p === null ? "" : formatPrice(p))}
          placeholder="9,000"
          suffix="원"
          required
        />
        <InputWithLabel
          textarea
          value={editedMenu}
          setValue={setEditedMenu}
          label="설명"
          name="description"
          stringToProp={emptyToU}
          propToString={uToEmpty}
          placeholder="설명을 입력하세요"
        />
        <InputWithLabel
          value={editedMenu}
          label="이미지"
          name="image"
          setValue={setEditedMenu}
          stringToProp={emptyToU}
          propToString={uToEmpty}
          placeholder="https://example.com/foo.png"
        />
        <ButtonContainer>
          <button type="submit" className={styles["green"]}>
            저장
          </button>
          <Link to="/stores/1">취소</Link>
        </ButtonContainer>
      </Form>
    </div>
  );
}
