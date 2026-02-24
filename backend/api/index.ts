import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();

const bootstrap = async (expressInstance: express.Express) => {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressInstance),
    );
    app.enableCors();
    await app.init();
};

export default async (req: any, res: any) => {
    await bootstrap(server);
    server(req, res);
};
