namespace Domain.Entities;
public class DepartmentFunction
{
    public Department Department{get;set;} = null!;
    public int DepartmentID {get;set;}
    public Function Function{get;set;} = null!;
    public int FunctionID{get;set;}
}