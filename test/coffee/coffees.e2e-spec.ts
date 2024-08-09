import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';

describe('[Feature] (e2e) Coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'pass123',
          database: 'coffees-test',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it.todo('GET /coffees');
  // it('GET /coffees', () => {
  //   return request(app.getHttpServer())
  //     .get('/coffees')
  //     .expect(200)
  //     .expect([
  //       {
  //         id: 1,
  //         name: 'test',
  //         brand: 'test brand',
  //         flavors: ['test flavor'],
  //       },
  //     ]);
  // });

  it.todo('GET /coffees/:id');
  // it('GET /coffees/:id', () => {
  //   return request(app.getHttpServer())
  //     .get('/coffees/1')
  //     .expect(200)
  //     .expect({
  //       id: 1,
  //       name: 'test',
  //       brand: 'test brand',
  //       flavors: ['test flavor'],
  //     });
  // });

  const coffee = {
    title: 'White Coffee',
    brand: 'Starbucks',
    flavors: ['Chocolate', 'Vanilla'],
  };

  it('POST /coffees', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedCoffee = {
          ...coffee,
          flavors: expect.arrayContaining(
            coffee.flavors.map((name) => expect.objectContaining({ name })),
          ),
        };
        expect(body.data).toEqual(expect.objectContaining(expectedCoffee));
      });
  });

  it.todo('PATCH /coffees/:id');
  // it('PATCH /coffees/:id', () => {
  //   return request(app.getHttpServer())
  //     .patch('/coffees/1')
  //     .send({ brand: 'updated brand' })
  //     .expect(200)
  //     .expect({
  //       id: 1,
  //       name: 'test',
  //       brand: 'updated brand',
  //       flavors: ['test flavor'],
  //     });
  // });

  it.todo('DELETE /coffees/:id');
  // it('DELETE /coffees/:id', () => {
  //   return request(app.getHttpServer()).delete('/coffees/1').expect(204);
  // });

  afterAll(async () => {
    await app.close();
  });
});
