using Asp.Versioning;
using Application.Features.Department;
using Application.Features.Function;
using Application.Features.Industry;
using Application.Features.Lesson;
using Infrastructure;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services
    .AddApiVersioning(options =>
    {
        options.ReportApiVersions = true;
        options.ApiVersionReader = new UrlSegmentApiVersionReader();
    })
    .AddMvc()
    .AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "KPM API",
        Version = "v1"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5175")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped<DepartmentService>();
builder.Services.AddScoped<FunctionService>();
builder.Services.AddScoped<IndustryService>();
builder.Services.AddScoped<LessonService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "KPM API v1");
});
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();
