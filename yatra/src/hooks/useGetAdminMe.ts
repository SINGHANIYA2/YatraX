import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAdminData } from "@/redux/adminSlice";

function useGetAdminMe(
  enabled: boolean = true
) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    const getAdmin = async () => {
      try {
        const { data } = await axios.get(
          "/api/admin/me"
        );

        dispatch(setAdminData(data));
      } catch (err) {
        console.log(err);
      }
    };

    getAdmin();
  }, [enabled, dispatch]);
}

export default useGetAdminMe;