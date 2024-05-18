import { Expose } from "class-transformer";

export class RegisterUserResponseDto {
    @Expose()
    email: string;

    @Expose()
    emailConfirmToken: string;
}