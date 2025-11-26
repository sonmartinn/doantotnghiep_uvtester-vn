import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/app/_components/ui/card'
import {
  CheckCircle2,
  Search,
  Shield,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react'

const Features = () => {
  const testerFeatures = [
    {
      icon: Search,
      title: 'Tìm Dự Án Phù Hợp',
      description:
        'Duyệt qua hàng trăm dự án kiểm thử phần mềm, lọc theo kỹ năng và mức lương mong muốn'
    },
    {
      icon: TrendingUp,
      title: 'Phát Triển Sự Nghiệp',
      description:
        'Tích lũy kinh nghiệm thực tế, xây dựng portfolio và nâng cao kỹ năng testing'
    },
    {
      icon: Shield,
      title: 'Thanh Toán An Toàn',
      description:
        'Hệ thống thanh toán minh bạch, đảm bảo quyền lợi cho mọi tester'
    }
  ]

  const companyFeatures = [
    {
      icon: Zap,
      title: 'Tuyển Dụng Nhanh Chóng',
      description:
        'Đăng dự án và nhận ứng tuyển từ các tester chuyên nghiệp trong vòng 24h'
    },
    {
      icon: CheckCircle2,
      title: 'Chất Lượng Đảm Bảo',
      description:
        'Hệ thống đánh giá và xếp hạng giúp bạn chọn được tester phù hợp nhất'
    },
    {
      icon: Clock,
      title: 'Quản Lý Hiệu Quả',
      description:
        'Dashboard trực quan theo dõi tiến độ, quản lý thanh toán và đánh giá kết quả'
    }
  ]

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-foreground text-4xl font-bold md:text-5xl">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Giải pháp toàn diện cho cả Tester và Nhà tuyển dụng
          </p>
        </div>

        {/* For Testers */}
        <div className="mb-16">
          <h3 className="text-primary mb-8 text-center text-3xl font-bold">
            Dành Cho Tester
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {testerFeatures.map((feature, index) => (
              <Card
                key={index}
                className="shadow-soft hover:shadow-glow border-0 bg-linear-(--gradient-card) transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* For Companies */}
        <div>
          <h3 className="text-secondary mb-8 text-center text-3xl font-bold">
            Dành Cho Nhà Tuyển Dụng
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {companyFeatures.map((feature, index) => (
              <Card
                key={index}
                className="shadow-soft hover:shadow-glow border-0 bg-linear-(--gradient-card) transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="bg-secondary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <feature.icon className="text-secondary h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
