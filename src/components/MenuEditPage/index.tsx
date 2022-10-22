import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMenuDataContext } from "../../contexts/MenuDataContext";
import {
  emptyToU,
  formatPrice,
  nanToNull,
  priceToNum,
  uToEmpty,
} from "../../lib/formatting";
import { displayType, MenuUpdateInput } from "../../lib/types";
import { ButtonContainer } from "../ButtonContainer";
import { Form, InputWithLabel, StaticField } from "../Form";
import styles from "./index.module.css";

export default function MenuEditPage() {
  const params = useParams();
  const menuId = useMemo(() => nanToNull(Number(params.menuId)), [params]);
  if (menuId === null) throw new Error("잘못된 URL");
  const { getMenuById, updateMenu } = useMenuDataContext();
  const oldMenu = useMemo(() => getMenuById(menuId), [getMenuById, menuId]);
  if (!oldMenu) throw new Error("메뉴가 존재하지 않습니다");
  const [menu, setMenu] = useState<
    (Omit<MenuUpdateInput, "price"> & { price: number | null }) | null
  >(null);
  useEffect(() => {
    setMenu(getMenuById(menuId));
  }, [getMenuById, menuId]);
  const navigate = useNavigate();
  return (
    menu && (
      <div className={styles["container"]}>
        <Form className={styles["form"]}>
          <h2>메뉴 수정</h2>
          <StaticField value={oldMenu.name} label="이름" />
          <StaticField value={displayType(oldMenu.type)} label="종류" />
          <InputWithLabel
            value={menu}
            label="가격"
            name="price"
            setValue={setMenu}
            stringToProp={(s) =>
              s === "" ? null : priceToNum(s) ?? menu.price
            }
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
              updateMenu(oldMenu.id, { ...menu, price });
              navigate(`/menus/${oldMenu.id}`);
            }}
            className={styles["green"]}
          >
            저장
          </button>
          <Link to={`/menus/${oldMenu.id}`}>취소</Link>
        </ButtonContainer>
      </div>
    )
  );
}
