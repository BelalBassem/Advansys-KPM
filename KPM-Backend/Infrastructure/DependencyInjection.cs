using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Application.Common.Interfaces;
namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") ;

        services.AddDbContext<ApplicationDBContext>(
            options => options.UseSqlServer(connectionString));
        services.AddScoped<IApplicationDBContext>(provider =>
            provider.GetRequiredService<ApplicationDBContext>());
        
        return services;
    }
}
