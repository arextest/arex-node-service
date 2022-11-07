import {
    Body,
    Controller, Inject, Post
} from "@nestjs/common";
import { CaseSendService } from "../../casesend/service/casesend.service";
import { CaseSendRequest } from "../model/casesendrequest";

@Controller()
export class CaseSendController {


    @Inject()
    private readonly caseSendService: CaseSendService


    @Post("/casesend")
    caseSend(@Body() caseSendRequest: CaseSendRequest) {
        return this.caseSendService.caseSend(caseSendRequest);
    }

}