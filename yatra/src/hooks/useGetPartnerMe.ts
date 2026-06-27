import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPartnerData } from "@/redux/partnerSlice";

function useGetPartnerMe(
  enabled: boolean = true
) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    const getPartner = async () => {
      try {
        const { data } = await axios.get(
          "/api/partner/me"
        );

        dispatch(setPartnerData(data));
      } catch (err) {
        console.log(err);
      }
    };

    getPartner();
  }, [enabled, dispatch]);
}

export default useGetPartnerMe;