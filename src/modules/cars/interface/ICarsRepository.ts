import ICars from './ICars';

export default interface ICarsRepository {
  create(car: ICars): Promise<string>;
  findById(id: string): Promise<ICars | null>;
  findAll(): Promise<ICars[]>;
  update(id: string, car: Partial<ICars>): Promise<ICars | null>;
  delete(id: string): Promise<void>;
}
