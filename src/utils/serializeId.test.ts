import { expect } from '@jest/globals'
import { parseModelWithId, serializeModelWithId } from './serializeId'
import { ObjectId } from 'mongodb'

describe('utils/serializeId', () => {
  describe('parseModelWithId', () => {
    it('should parse an object with field string (or string[]) into field ObjectId (or ObjectId[])', () => {
      const example = {
        myId: '123412341234123412341234',
        someIds: ['123412341234123412341234', '567856785678567856785678'],
        field1: 'notChanged'
      }
      const expectedResult = {
        myId: new ObjectId('123412341234123412341234'),
        someIds: [
          new ObjectId('123412341234123412341234'),
          new ObjectId('567856785678567856785678')
        ],
        field1: 'notChanged'
      }

      const result = parseModelWithId(example, 'myId', 'someIds')
      expect(result).toEqual(expectedResult)
    })

    it('should throw an error on invalid field', () => {
      const example = {
        myBadId: 1234,
        field1: 'notChanged'
      }

      const result = () => parseModelWithId(example, 'myBadId')
      expect(result).toThrow(new Error('parseId: not parsable to ObjectId'))
    })

    it('should throw an error on invalid ObjectId value to transform', () => {
      const example = {
        myBadId: '1234',
        field1: 'notChanged'
      }

      const result = () => parseModelWithId(example, 'myBadId')
      expect(result).toThrow(new Error('parseId: not parsable to ObjectId'))
    })

    it('should stay typesafe on field to try', () => {
      const example = {
        field1: 'notChanged'
      }

      // @ts-expect-error: "Argument of type '"myBadId"' is not assignable to parameter of type ..."
      const result = () => parseModelWithId(example, 'myBadId')
      expect(result).toThrow(new Error('parseId: not parsable to ObjectId'))
    })
  })

  describe('serializeModelWithId', () => {
    it('should serialize an object with field ObjectId (or ObjectId[]) into field string (or string[])', () => {
      const example = {
        myId: new ObjectId('123412341234123412341234'),
        someIds: [
          new ObjectId('123412341234123412341234'),
          new ObjectId('567856785678567856785678')
        ],
        field1: 'notChanged'
      }
      const expectedResult = {
        myId: '123412341234123412341234',
        someIds: ['123412341234123412341234', '567856785678567856785678'],
        field1: 'notChanged'
      }

      const result = serializeModelWithId(example, 'myId', 'someIds')
      expect(result).toEqual(expectedResult)
    })

    it('should throw an error on invalid field', () => {
      const example = {
        myBadId: 1234,
        field1: 'notChanged'
      }

      const result = () => serializeModelWithId(example, 'myBadId')
      expect(result).toThrow(new Error('serializeId: not serializable from ObjectId'))
    })

    it('should stay typesafe on field to try', () => {
      const example = {
        field1: 'notChanged'
      }
      // @ts-expect-error: "Argument of type '"myBadId"' is not assignable to parameter of type ..."
      const result = () => serializeModelWithId(example, 'myBadId')
      expect(result).toThrow(new Error('serializeId: not serializable from ObjectId'))
    })
  })
})
