import * as colors from "colors";
import * as moment from "moment";

export function configLog({ type, info }) {
  console.log(
    colors.green(`[Conf] ${process.pid}  - `) +
      colors.black(moment().format("MM/DD/YYYY, h:mm:ss A")) +
      colors.green(`     LOG `) +
      colors.bgYellow(`[${type}] `) +
      colors.bgGreen(`${info} `),
  );
}