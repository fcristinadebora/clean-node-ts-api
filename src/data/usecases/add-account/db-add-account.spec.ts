import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountModel = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountModel)
    expect(encryptSpy).toHaveBeenLastCalledWith(accountModel.password)
  })

  // test('Should throw if encrypter throws', async () => {
  //   const { sut, encrypterStub } = makeSut()
  //   const error = new Error()
  //   jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise(
  //     (resolve, reject) => reject(error)
  //   ))

  //   const accountModel = {
  //     name: 'valid_name',
  //     email: 'valid_email@mail.com',
  //     password: 'valid_password'
  //   }
  //   const promise = await sut.add(accountModel)
  //   await expect(promise).rejects.toThrow()
  // })
})
