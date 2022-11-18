import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatPrice, nanToNull, priceToNum } from "../../lib/formatting";
import { displayType } from "../../lib/types";
import { ButtonContainer } from "../ButtonContainer";
import { Form, InputWithLabel, StaticField } from "../Form";
import styles from "./index.module.css";
import { useSessionContext } from "../../contexts/SessionContext";
import { apiUpdateMenu, useApiData, useApiMenuFetcher } from "../../lib/api";
import { toast } from "react-toastify";
import axios from "axios";

function useMenuEditPageLogic() {
  const menuId = nanToNull(parseInt(useParams().menuId ?? "NaN"));
  const navigate = useNavigate();
  const { me, withToken } = useSessionContext();
  const { data: oldMenu } = useApiData(useApiMenuFetcher(menuId));
  const dead = useRef(false);
  useEffect(() => {
    if (dead.current) return;
    if (!me) {
      toast.warning("메뉴를 수정하려면 로그인하세요");
      navigate("/auth/login", { replace: true });
      dead.current = true;
    } else if (!oldMenu) {
      toast.warning("존재하지 않는 메뉴입니다");
      navigate(`/stores/${me.id}`, { replace: true });
      dead.current = true;
    }
  }, [dead, navigate, oldMenu, me]);
  const [menu, setMenu] = useState<{
    price?: number | null;
    image?: string | null;
    description?: string | null;
  }>({});
  const submitMenu = useCallback(() => {
    if (!oldMenu) return;
    const { price, image, description } = menu;
    if (price === null) {
      toast.error("invalid price");
      return;
    }
    withToken((token) =>
      apiUpdateMenu(oldMenu.id, { price, image, description }, token)
    )
      .then((newMenu) => {
        if (!newMenu) return;
        toast.success("메뉴를 저장했습니다");
        navigate(`/menus/${oldMenu.id}`);
      })
      .catch((err) => {
        const message = axios.isAxiosError(err) && err.response?.data.message;
        if (message) toast.error("메뉴를 저장할 수 없습니다: " + message);
        else throw err;
      });
  }, [menu, navigate, oldMenu, withToken]);
  return { submitMenu, setMenu, menu, oldMenu };
}

export default function MenuEditPage() {
  const { submitMenu, setMenu, menu, oldMenu } = useMenuEditPageLogic();
  return menu && oldMenu ? (
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
            (s === "" ? null : priceToNum(s) ?? menu.price) ?? null
          }
          propToString={(p) =>
            p === undefined
              ? formatPrice(oldMenu.price)
              : p === null
              ? ""
              : formatPrice(p)
          }
          placeholder="5,000"
          suffix="원"
        />
        <InputWithLabel
          textarea
          value={menu}
          setValue={setMenu}
          label="설명"
          name="description"
          stringToProp={(s) => (s === "" ? null : s)}
          propToString={(p) =>
            (p === undefined ? oldMenu.description : p) ?? ""
          }
          placeholder="설명을 입력하세요"
        />
        <InputWithLabel
          value={menu}
          label="이미지"
          name="image"
          setValue={setMenu}
          stringToProp={(s) => (s === "" ? null : s)}
          propToString={(p) => (p === undefined ? oldMenu.image : p) ?? ""}
          placeholder="https://example.com/foo.png"
        />
      </Form>
      <ButtonContainer>
        <button onClick={submitMenu} className={styles["green"]}>
          저장
        </button>
        <Link to={`/menus/${oldMenu.id}`}>취소</Link>
      </ButtonContainer>
    </div>
  ) : (
    <div>메뉴가 존재하지 않습니다</div>
  );
}
