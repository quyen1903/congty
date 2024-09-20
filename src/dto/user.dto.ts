import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDTO {
    @MaxLength(20)
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

export class LoginDTO{
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

export class UpdateDTO {
    @MaxLength(20)
    @IsNotEmpty()
    @IsString()
    newName: string;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    newEmail: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    newPassword: string;

    constructor(newName: string, newEmail: string, newPassword: string) {
        this.newName = newName;
        this.newEmail = newEmail;
        this.newPassword = newPassword;
    }
}