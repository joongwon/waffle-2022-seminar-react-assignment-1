import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatPrice, nanToNull, priceToNum } from "../../lib/formatting";
import { displayType, Menu, MenuType } from "../../lib/types";
import { ButtonContainer } from "../ButtonContainer";
import { Form, InputWithLabel, StaticField } from "../Form";
import styles from "./index.module.css";
import { useSessionContext } from "../../contexts/SessionContext";
import { apiUpdateMenu, useApiData, useApiMenuFetcher } from "../../lib/api";
import { toast } from "react-toastify";
import { ConditionalLink, RedirectWithMessage, to } from "../../lib/hooks";
import { axiosErrorHandler, axiosErrorStatus } from "../../lib/error";

function useMenuEditPageLogic() {
  const menuId = nanToNull(parseInt(useParams().menuId ?? "NaN"));
  const navigate = useNavigate();
  const { withToken } = useSessionContext();
  const {
    data: oldMenu,
    loading: menuLoading,
    error,
  } = useApiData(useApiMenuFetcher(menuId));
  const [editedMenu, setEditedMenu] = useState<{
    price?: number | null;
    image?: string | null;
    description?: string | null;
  }>({});
  const submitMenu = useCallback(() => {
    if (!oldMenu) return;
    const { price, image, description } = editedMenu;
    if (price === null) {
      toast.error("가격을 입력하세요");
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
      .catch(axiosErrorHandler("메뉴를 저장할 수 없습니다"));
  }, [editedMenu, navigate, oldMenu, withToken]);
  console.log("data.name: ", oldMenu?.name, "loading: ", menuLoading);
  return {
    submitMenu,
    setEditedMenu,
    editedMenu,
    oldMenu,
    error: error?.payload,
    menuLoading,
    menuId,
  };
}

function useCheckRedirect(
  menuLoading: boolean,
  oldMenu?: Menu,
  error?: unknown
) {
  const { me, loading: meLoading } = useSessionContext();
  console.log("my id: ", me?.id, "menu owner id: ", oldMenu?.owner.id);
  return {
    notLoggedIn: !meLoading && !me,
    notMyMenu:
      !meLoading && !menuLoading && me && oldMenu && me.id !== oldMenu.owner.id,
    menuNotFound: axiosErrorStatus(error) === 404,
  };
}

export default function MenuEditPage() {
  const {
    submitMenu,
    setEditedMenu,
    editedMenu,
    oldMenu,
    error,
    menuLoading,
    menuId,
  } = useMenuEditPageLogic();
  const { notLoggedIn, notMyMenu, menuNotFound } = useCheckRedirect(
    menuLoading,
    oldMenu,
    error
  );
  if (notLoggedIn)
    return (
      <RedirectWithMessage
        message={"메뉴를 수정하려면 먼저 로그인하세요"}
        to="/auth/login"
      />
    );
  if (notMyMenu)
    return (
      <RedirectWithMessage
        message="내 메뉴가 아닙니다"
        to={`/menus/${menuId}`}
      />
    );
  if (menuNotFound)
    return (
      <RedirectWithMessage
        message={"해당 아이디의 메뉴가 존재하지 않습니다"}
        to={-1}
      />
    );
  return (
    <div className={styles["container"]}>
      <Form className={styles["form"]}>
        <h2>메뉴 수정</h2>
        <StaticField value={oldMenu?.name ?? "맛있는와플"} label="이름" />
        <StaticField
          value={displayType(oldMenu?.type ?? MenuType.waffle)}
          label="종류"
        />
        <InputWithLabel
          value={editedMenu}
          label="가격"
          name="price"
          setValue={setEditedMenu}
          stringToProp={(s) =>
            (s === "" ? null : priceToNum(s) ?? editedMenu.price) ?? null
          }
          propToString={(p) =>
            p === undefined
              ? formatPrice(oldMenu?.price ?? 0)
              : p === null
              ? ""
              : formatPrice(p)
          }
          placeholder="5,000"
          suffix="원"
        />
        <InputWithLabel
          textarea
          value={editedMenu}
          setValue={setEditedMenu}
          label="설명"
          name="description"
          stringToProp={(s) => (s === "" ? null : s)}
          propToString={(p) =>
            (p === undefined ? oldMenu?.description : p) ?? ""
          }
          placeholder="설명을 입력하세요"
        />
        <InputWithLabel
          value={editedMenu}
          label="이미지"
          name="image"
          setValue={setEditedMenu}
          stringToProp={(s) => (s === "" ? null : s)}
          propToString={(p) => (p === undefined ? oldMenu?.image : p) ?? ""}
          placeholder="https://example.com/foo.png"
        />
      </Form>
      <ButtonContainer>
        <button onClick={submitMenu} className={styles["green"]}>
          저장
        </button>
        <ConditionalLink to={to`/menus/${oldMenu?.id}`}>취소</ConditionalLink>
      </ButtonContainer>
    </div>
  );
}
