import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { CourriersService } from "./courriers.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("courriers")
export class CourriersController {
  constructor(private readonly courriersService: CourriersService) {}

  @Get()
  async findAll() {
    return this.courriersService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("pdf", {
      storage: diskStorage({
        destination: "./uploads/courriers",
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `courrier-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== "application/pdf") {
          return callback(
            new BadRequestException("Seuls les fichiers PDF sont autorisés") as any,
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
      },
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.courriersService.create(body, file);
  }
}