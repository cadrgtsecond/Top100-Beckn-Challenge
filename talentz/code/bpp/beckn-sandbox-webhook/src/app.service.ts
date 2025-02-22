/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();
@Injectable()
export class AppService {
  async getSandBoxDataService(body: any) {
    console.log(body.message.intent.item.tags);
    let skillType = body.message.intent.item.tags[0].list[0].value
    //let skillType=body.message.intent.item.tags[1].list
       

    try {
      if (body.context.action.includes("on_")) {
        return;
      }
      let sandboxUrl = "";
      if (
        body.context.domain.includes("financial") &&
        !body.context.domain.includes("onest")
      ) {
        sandboxUrl = `${process.env.SANDBOXURL}/financial-services/${body.context.action}`;
      } else if (
        body.context.domain.includes("dsep") ||
        body.context.domain.includes("onest")
      ) {
        sandboxUrl = `${process.env.SANDBOXURL}/dsep/${
          body.context.action
        }/?skillType=${skillType}`;
      } else if (body.context.domain.includes("dent")) {
        sandboxUrl = `${process.env.SANDBOXURL}/dent/${body.context.action}`;
      } else if (body.context.domain.includes("dhp")) {
        sandboxUrl = `${process.env.SANDBOXURL}/dhp/${body.context.action}`;
      } else if (body.context.domain.includes("supply-chain-services")) {
        sandboxUrl = `${process.env.SANDBOXURL}/industry-4.0/${body.context.action}`;
      } else if (
        body.context.domain.includes("online-dispute-resolution:0.1.0")
      ) {
        sandboxUrl = `${process.env.SANDBOXURL}/odr/${body.context.action}`;
      } else if (body.context.domain.includes("local-retail")) {
        const default_version = "1.1.0";
        let version = default_version;
        const current_version = body?.context?.core_version;
        if (current_version) {
          version = current_version;
        }
        sandboxUrl = `${process.env.SANDBOXURL}/local-retail/${version}/${body.context.action}`;
      } else {
        sandboxUrl = `${process.env.SANDBOXURL}/mobility/${body.context.action}`;
      }
      console.log("called", sandboxUrl);
      const { data: responseData } = await axios.post(sandboxUrl, body);
      console.log(responseData,"whfbhljkbdc");
      
      if (!responseData?.context) {
        console.log(
          new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
          "Invalid response from sandbox bpp api"
        );
        return;
      }

      responseData.context.message_id = body.context.message_id;
      responseData.context.bap_id = body.context.bap_id;
      responseData.context.bap_uri = body.context.bap_uri;
      responseData.context.transaction_id = body.context.transaction_id;
      responseData.context.domain = body.context.domain;
      console.log();

      if (body?.context?.bpp_id)
        responseData.context.bpp_id = "mulearn-hackninjas-bpp";

      if (body?.context?.bpp_uri)
        responseData.context.bpp_uri = "https://mulearn-hackninjas-bap.loca.it";

      let requestAction = null;
      responseData.context.bpp_uri = "https://mulearn-hackninjas-bap.loca.it";
      responseData.context.bpp_id = "mulearn-hackninjas-bpp";

      switch (body.context.action) {
        case "search":
          requestAction = "on_search";
          break;
        case "select":
          requestAction = "on_select";
          break;
        case "init":
          requestAction = "on_init";
          break;
        case "confirm":
          requestAction = "on_confirm";
          break;
        case "status":
          requestAction = "on_status";
          break;
        case "track":
          requestAction = "on_track";
          break;
        case "cancel":
          requestAction = "on_cancel";
          break;
        case "update":
          requestAction = "on_update";
          break;
        case "rating":
          requestAction = "on_rating";
          break;
        case "support":
          requestAction = "on_support";
          break;
        case "get_cancellation_reasons":
          requestAction = "cancellation_reasons";
          break;
        case "get_rating_categories":
          requestAction = "rating_categories";
          break;

        default:
          console.log(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
            "Invalid request action -> " + requestAction
          );
          return;
      }

      const bppClientUrl = `${process.env.BPPCLIENTURL}/${requestAction}`;

      (async () => {
        console.log(
          "\n\n",
          "-----------------------------------------------------------",
          "\n",
          new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
          `\n`,
          `\n`,
          `Making post request to: ${bppClientUrl}`,
          `\n`,
          `\n`,
          `Body: ${JSON.stringify(body)}`,
          `\n`,
          "-----------------------------------------------------------"
        );
        try {
          console.log(responseData, "respon");

          const r = await axios.post(bppClientUrl, responseData);
        } catch (error) {
          console.log("error=>", error.message);
        }
      })();
    } catch (err) {
      console.log("err", err);
    }
  }
}
