const stats = [
    { id: 1, name: 'Creators on the Platform', value: '2,000' },
    { id: 2, name: 'Images Generated', value: '30,000' },
    // { id: 3, name: 'Uptime guarantee', value: '99.9%' },
    // { id: 4, name: 'Paid out to creators', value: '$70M' },
  ]
  
  export default function TrustSection() {
    return (
      <div className="bg-white py-20 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center ">
              <h2 className="text-3xl font-montas  tracking-wide font-semibold text-gray-800 sm:text-4xl">
                Trusted By Creator's Worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 font-montas font-medium text-gray-600">
              Used by solo creators, hobbyists, and marketing teams
              </p>
            </div>
            <dl className="mt-7  flex  rounded-2xl mx-auto text-center justify-center">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col rounded-3xl p-3 mx-3 bg-gray-50 border-x-gray-400 border-y-gray-400 border-2 w-36">
                  <dt className="text-md my-2  font-montas leading-6 text-gray-600">{stat.name}</dt>
                  <dd className="order-first flex items-center justify-center font-montas text-2xl font-bold tracking-tight text-gray-900">{stat.value} <p className=' flex justify-center items-center'>&nbsp;+</p></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    )
  }
  