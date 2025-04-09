import { Injectable } from '@nestjs/common'
import { CommonService } from '../common/common.service'
import { GradeRepository } from './grade.repository'
import { GradeToDBDto } from './dto/grade.db.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class GradeService {
  constructor(
    private readonly gradeRepository: GradeRepository,
    private readonly commonService: CommonService,
    private readonly studentService: UserService,
  ) {}

  async findAll(student_id: number) {
    const rs = await this.gradeRepository.findAll()
    const final = rs.filter((item) => {
      return item.student.student_id === student_id
    })

    //group by term
    final.map((item) => {
      return this.commonService.deleteField(item, ['grade_id', 'student_id'])
    })

    const groupByTerm = this.groupByTerm(final)
    return groupByTerm
  }

  private groupByTerm(data: any) {
    const result = []
    const map = new Map()

    for (const item of data) {
      if (!map.has(item.term)) {
        map.set(item.term, [])
        result.push(map.get(item.term))
      }
      map.get(item.term).push(item)
    }

    const avgAccumulateArr = result
      .map((item) => {
        const rs =
          item.reduce((acc, cur) => acc + cur.digit_score, 0) / item.length

        const term = item[0].term
        return { term, avg: parseFloat(rs.toFixed(2)) }
      })
      .sort((a, b) => a.term - b.term)

    const creditSum = result
      .map((item) => {
        const credit = item.reduce((acc, cur) => acc + cur.subject.credits, 0)
        const term = item[0].term
        return { term, credit }
      }, 0)
      .sort((a, b) => a.term - b.term)
    const sumCreditFail = result
      .map((item) => {
        return item
          .filter((item) => item.digit_score < 4)
          .reduce((acc, cur) => acc + cur.subject.credits, 0)
      })
      .reduce((acc, cur) => acc + cur, 0)
    //current result is array of map i wanna convert it to array of object
    const final = []
    result
      .sort((a, b) => a[0].term - b[0].term)
      .map((item, index) => {
        //get subject fail when digit_score < 4
        const failSubject = item.filter((item) => item.digit_score < 4)

        const filteredAvgAccumulateArr = avgAccumulateArr.filter(
          (item, idx) => idx <= index,
        )
        const filteredCreditSum = creditSum.filter((item, idx) => idx <= index)

        const obj = {}
        const newItem = item.map((item) => {
          return {
            ...item,
            rank: this.convetRanker(item.digit_score),
          }
        })

        obj['grade'] = newItem
        const length = item.length
        const avgScore10 =
          item.reduce((acc, cur) => acc + cur.digit_score, 0) / length
        obj['avgScore10'] = avgScore10.toFixed(2)
        const avgScore4 = avgScore10 / 2.5
        obj['avgScore4'] = avgScore4.toFixed(2)
        const avgAccumulateScore =
          filteredAvgAccumulateArr.reduce((acc, cur) => acc + cur.avg, 0) /
          filteredAvgAccumulateArr.length
        obj['avgAccumulateScore'] = avgAccumulateScore.toFixed(2)
        const avgAccumulateScore4 = avgAccumulateScore / 2.5
        obj['avgAccumulateScore4'] = avgAccumulateScore4.toFixed(2)

        const sumOfCreditInTerm = item.reduce((acc, cur) => {
          return acc + cur.subject.credits
        }, 0)
        const sumCreditPass =
          sumOfCreditInTerm -
          failSubject.reduce((acc, cur) => acc + cur.subject.credits, 0)
        obj['sumCreditPass'] = sumCreditPass

        obj['sumCreditFail'] = sumCreditFail

        const sumOfCreditRegis = filteredCreditSum.reduce(
          (acc, cur) => acc + cur.credit,
          0,
        )
        obj['sumOfCreditRegis'] = sumOfCreditRegis

        const sumOfCreditAccumulatePass = sumOfCreditRegis - sumCreditFail
        obj['sumOfCreditAccumulatePass'] = sumOfCreditAccumulatePass

        const rankerAccumulate = this.convetRanker(avgAccumulateScore)
        obj['rankerAccumulate'] = rankerAccumulate
        const rankerOfTerm = this.convetRanker(avgScore10)
        obj['rankerOfTerm'] = rankerOfTerm
        obj['term'] = item[0].term
        obj['year'] = item[0].year
        final.push(obj)
      })

    return final
  }
  async uploadGrade(data: GradeToDBDto) {
    const dto = {
      letter_score: this.convertDigitToLetter(data.digit_score),
      grade_id: this.commonService.generateId(),
      ...data,
    }
    const rs = await this.gradeRepository.uploadGrade(dto)
    if (rs) {
      if (this.commonService.checkDigitScore(data.digit_score)) {
        await this.studentService.updateUser(data.student_id, {
          credit: rs.subject.credits,
        })
      } else {
      }
      return true
    } else {
      return false
    }
  }

  async enrolledSubjects(student_id: number) {
    const rs = await this.gradeRepository.getEnrolledSubjects(student_id)
    return rs
  }

  private convertDigitToLetter(digit: number) {
    if (digit >= 9) {
      return 'A+'
    } else if (digit >= 8.5) {
      return 'A'
    } else if (digit >= 8) {
      return 'B+'
    } else if (digit >= 7) {
      return 'B'
    } else if (digit >= 6) {
      return 'C+'
    } else if (digit >= 5.5) {
      return 'C'
    } else if (digit >= 5) {
      return 'D+'
    } else if (digit >= 4) {
      return 'D'
    }
    return 'F'
  }

  private convetRanker(score: number) {
    if (score >= 9) {
      return 'Xuất sắc'
    } else if (score > 8.0) {
      return 'Giỏi'
    } else if (score > 6.5) {
      return 'Khá'
    } else if (score > 5.0) {
      return 'Trung bình'
    } else if (score > 4.0) {
      return 'Yếu'
    } else {
      return 'Kém'
    }
  }
}
