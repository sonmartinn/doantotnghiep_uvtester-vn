import { UserPlus, FileText, CheckSquare, Star } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Đăng Ký Tài Khoản',
      description:
        'Tạo profile miễn phí với thông tin kỹ năng, kinh nghiệm hoặc nhu cầu tuyển dụng'
    },
    {
      icon: FileText,
      title: 'Tìm Kiếm/Đăng Dự Án',
      description:
        'Tester tìm dự án phù hợp, Công ty đăng dự án cần tuyển với mô tả chi tiết'
    },
    {
      icon: CheckSquare,
      title: 'Kết Nối & Làm Việc',
      description:
        'Xác nhận hợp tác, thực hiện công việc testing theo yêu cầu dự án'
    },
    {
      icon: Star,
      title: 'Thanh Toán & Đánh Giá',
      description:
        'Hoàn thành thanh toán an toàn, đánh giá hai chiều để xây dựng uy tín'
    }
  ]

  return (
    <section className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-foreground text-4xl font-bold md:text-5xl">
            Cách Thức Hoạt Động
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            4 bước đơn giản để bắt đầu kết nối
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-4">
          {/* Connection lines */}
          <div
            className="from-primary via-secondary to-accent absolute top-16 right-0 left-0 -z-10 hidden h-0.5 bg-gradient-to-r md:block"
            style={{ top: '4rem', left: '12%', right: '12%' }}
          />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center space-y-4 text-center"
            >
              {/* Step number */}
              <div className="relative">
                <div className="shadow-glow flex h-32 w-32 items-center justify-center rounded-full bg-linear-(--gradient-hero)">
                  <step.icon className="h-14 w-14 text-white" />
                </div>
                <div className="bg-accent absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg">
                  {index + 1}
                </div>
              </div>

              <h3 className="text-foreground text-xl font-bold">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
