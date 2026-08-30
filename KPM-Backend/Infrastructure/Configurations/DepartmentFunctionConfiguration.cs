using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class DepartmentFunctionConfiguration : IEntityTypeConfiguration<DepartmentFunction>
{
    public void Configure(EntityTypeBuilder<DepartmentFunction> builder)
    {
        builder.ToTable("DepartmentFunction");

        builder.HasKey(departmentFunction => new
        {
            departmentFunction.FunctionID,
            departmentFunction.DepartmentID
        });

        builder.Property(departmentFunction => departmentFunction.FunctionID)
            .HasColumnName("FunctionId");

        builder.Property(departmentFunction => departmentFunction.DepartmentID)
            .HasColumnName("DepartmentId");

        builder.HasOne(departmentFunction => departmentFunction.Department)
            .WithMany(department => department.DepartmentFunction)
            .HasForeignKey(departmentFunction => departmentFunction.DepartmentID);

        builder.HasOne(departmentFunction => departmentFunction.Function)
            .WithMany(function => function.DepartmentFunction)
            .HasForeignKey(departmentFunction => departmentFunction.FunctionID);
    }
}
