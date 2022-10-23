import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMenuDataContext } from "../../contexts/MenuDataContext";
import {
  emptyToU,
  formatPrice,
  priceToNum,
  uToEmpty,
} from "../../lib/formatting";
import { displayType, MenuCreateInput, MenuType } from "../../lib/types";
import { ButtonContainer } from "../ButtonContainer";
import { Form, InputWithLabel } from "../Form";
import styles from "./index.module.css";
import { useSessionContext } from "../../contexts/SessionContext";

type MenuForm = Omit<MenuCreateInput, "price"> & { price: number | null };

export default function MenuEditPage() {
  const { addMenu } = useMenuDataContext();
  const { user } = useSessionContext();
  const [menu, setMenu] = useState<MenuForm>({
    price: null,
    type: MenuType.waffle,
    name: "",
  });
  const navigate = useNavigate();
  const dead = useRef(false);
  useEffect(() => {
    if (dead.current) return;
    if (!user) {
      alert("메뉴를 수정하려면 로그인하세요");
      navigate("/auth/login", { replace: true });
      dead.current = true;
    }
  }, [dead, navigate, user]);
  const id = useId();
  return (
    <div className={styles["container"]}>
      <Form className={styles["form"]}>
        <h2>메뉴 추가</h2>
        <InputWithLabel
          value={menu}
          label="이름"
          name="name"
          setValue={setMenu}
        />
        <label htmlFor={id}>종류</label>
        <select
          onChange={(e) =>
            setMenu({ ...menu, type: e.target.value as MenuType })
          }
          value={menu.type}
        >
          {Object.values(MenuType).map((v) => (
            <option value={v} key={v}>
              {displayType(v as MenuType)}
            </option>
          ))}
        </select>
        <InputWithLabel
          value={menu}
          label="가격"
          name="price"
          setValue={setMenu}
          stringToProp={(s) => (s === "" ? null : priceToNum(s) ?? menu.price)}
          propToString={(p) => (p === null ? "" : formatPrice(p))}
        />
        <InputWithLabel
          textarea
          value={menu}
          setValue={setMenu}
          label="설명"
          name="description"
          stringToProp={emptyToU}
          propToString={uToEmpty}
        />
        <InputWithLabel
          value={menu}
          label="이미지"
          name="image"
          setValue={setMenu}
          stringToProp={emptyToU}
          propToString={uToEmpty}
        />
      </Form>
      <ButtonContainer>
        <button
          onClick={() => {
            const price = menu.price;
            if (price === null) {
              alert("invalid price");
              return;
            }
            const newMenu = addMenu({ ...menu, price });
            navigate(`/menus/${newMenu.id}`);
          }}
          className={styles["green"]}
        >
          저장
        </button>
        <Link to="/stores/1">취소</Link>
      </ButtonContainer>
    </div>
  );
}
