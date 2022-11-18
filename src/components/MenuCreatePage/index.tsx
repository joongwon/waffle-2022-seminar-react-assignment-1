import {
  FormEventHandler,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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
import axios from "axios";

function useMenuEditPageLogic() {
  const { me, withToken } = useSessionContext();
  const [menu, setMenu] = useState({
    price: null as number | null,
    type: null as MenuType | null,
    name: "",
    description: undefined as string | undefined,
    image: undefined as string | undefined,
  });
  const navigate = useNavigate();
  const dead = useRef(false);
  useEffect(() => {
    if (dead.current) return;
    if (!me) {
      alert("메뉴를 수정하려면 로그인하세요");
      navigate("/auth/login", { replace: true });
      dead.current = true;
    }
  }, [dead, navigate, me]);
  const submitMenu = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      const { name, price, type, image, description } = menu;
      if (!type || !name || !price) {
        toast.warning("메뉴의 타입, 이름, 가격을 지정해주세요");
        return;
      }
      withToken((token) =>
        apiCreateMenu({ name, price, type, image, description }, token)
      )
        .then((newMenu) => {
          if (!newMenu) return;
          toast.success("새 메뉴를 생성하였습니다");
          navigate(`/menus/${newMenu?.data.id}`);
        })
        .catch((err) => {
          const message = axios.isAxiosError(err) && err.response?.data.message;
          if (message) toast.error("새 메뉴를 생성할 수 없습니다: " + message);
          else throw err;
        });
    },
    [menu, navigate, withToken]
  );
  return { submitMenu, menu, setMenu };
}

export default function MenuEditPage() {
  const { submitMenu, menu, setMenu } = useMenuEditPageLogic();
  const id = useId();
  return (
    <div className={styles["container"]}>
      <Form className={styles["form"]} onSubmit={submitMenu}>
        <h2>메뉴 추가</h2>
        <InputWithLabel
          value={menu}
          label="이름"
          name="name"
          setValue={setMenu}
          placeholder="맛있는와플"
          required
        />
        <label htmlFor={id}>종류</label>
        <select
          onChange={(e) =>
            setMenu({
              ...menu,
              type: e.target.value === "" ? null : (e.target.value as MenuType),
            })
          }
          value={menu.type ?? ""}
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
          value={menu}
          label="가격"
          name="price"
          setValue={setMenu}
          stringToProp={(s) => {
            if (s === "") return null;
            const num = priceToNum(s);
            if (num === null) return menu.price;
            return num;
          }}
          propToString={(p) => (p === null ? "" : formatPrice(p))}
          placeholder="9,000"
          suffix="원"
          required
        />
        <InputWithLabel
          textarea
          value={menu}
          setValue={setMenu}
          label="설명"
          name="description"
          stringToProp={emptyToU}
          propToString={uToEmpty}
          placeholder="설명을 입력하세요"
        />
        <InputWithLabel
          value={menu}
          label="이미지"
          name="image"
          setValue={setMenu}
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
