// import {
//   CanActivate,
//   ExecutionContext,
//   HttpException,
//   HttpStatus,
//   Inject,
//   Injectable,
// } from "@nestjs/common";
// import { Cache } from "cache-manager";
// import { CACHE_MANAGER } from "@nestjs/cache-manager";
// import { HttpExceptionCustom } from "../../common/common.exception";
// // import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     @Inject(CACHE_MANAGER) private cacheManager: Cache // private jwtService: JwtService
//   ) {}
//   async canActivate(context: ExecutionContext) {
//     const url = context.switchToHttp().getRequest().url;
//     const request = context.switchToHttp().getRequest();

//     if (url === "/api/users/login") {
//       request.error = {
//         message: "Token expired or incorrect",
//         status: HttpStatus.UNAUTHORIZED,
//       };
//       return true;
//     } else {
//       let token = request.cookies !== undefined ? request.cookies.token : null;
//       if (!token) {
//         token =
//           request.headers !== undefined
//             ? request.headers.authorization !== undefined &&
//               request.headers.authorization.split(" ")[1]
//             : request.handshake.headers.authorization
//             ? request.handshake.headers.authorization
//             : request.handshake.auth.Authorization.split(" ")[1];
//       }
//       const whiteList = ["/api/users/login", "/api/users/register"];
//       if (!token) {
//         request.error = {
//           message: "Token expired or incorrect",
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         throw new HttpException(
//           "Oops! It seems like there's an issue with your access token. It may be invalid, missing, or expired. Please try again.",
//           HttpStatus.FORBIDDEN
//         );
//       } else if (!token && !whiteList.includes(url)) {
//         request.error = {
//           message: "Token expired or incorrect",
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         throw new HttpException(
//           "Oops! It seems like there's an issue with your access token. It may be invalid, missing, or expired. Please try again.",
//           HttpStatus.FORBIDDEN
//         );
//       }
//       if (token) {
//         const user = await this.cacheManager.get(token);
//         const parsedUser = JSON.parse(user as any);
//         try {
//           if (!parsedUser) {
//             request.error = {
//               message: "Token expired or incorrect",
//               status: HttpStatus.UNAUTHORIZED,
//             };
//             return true;
//           } else {
//             request.token = token;
//             request.user = parsedUser;
//             return true;
//           }
//         } catch (error) {
//           throw new HttpExceptionCustom(
//             "Token expired or incorrect",
//             HttpStatus.UNAUTHORIZED
//           );
//         }
//       } else {
//         request.error = {
//           message: "Token expired or incorrect",
//           status: HttpStatus.UNAUTHORIZED,
//         };
//         return true;
//       }
//     }
//   }
// }
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    const whiteList = ['/api/users/login', '/api/users/register'];
    if (whiteList.includes(url)) return true;

    // Lấy token từ cookie hoặc header
    let token = null;

    if (request.cookies?.token) {
      token = request.cookies.token;
    } else if (request.headers?.authorization?.startsWith('Bearer ')) {
      token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.cacheManager.get(token);
    console.log('🔐 Token:', token);
    console.log('👤 User from cache:', user);
    
    if (!user) {
      throw new HttpException('Token expired or not found', HttpStatus.UNAUTHORIZED);
    }

    request.user = user;
    request.token = token;

    return true;
  }
}

