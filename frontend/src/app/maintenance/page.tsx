"use client";

import { useState} from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Space,
  Tag,
  Tooltip,
  Radio,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  maintenanceApi,
  partApi,
  Maintenance,
  MaintenanceStatus,
  MaintenanceFrequency,
  MaintenanceReferenceType,
  Part
} from "@/services/api";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TableOutlined,
  ScheduleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import DataTable from "@/components/DataTable";
import MaintenanceCalendar from "@/components/MaintenanceCalendar";

export default function MaintenancePage() {
  const [form] = Form.useForm();
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [maintenanceToEdit, setMaintenanceToEdit] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [filters, setFilters] = useState({
    title: "",
    status: "",
    partId: "",
  });
  const queryClient = useQueryClient();
  
  const { data: maintenances, isLoading: maintenancesLoading } = useQuery<Maintenance[]>(
    "maintenances", 
    () => maintenanceApi.getAll().then((res: any) => res.data)
  );

  const { data: parts, isLoading: partsLoading } = useQuery<Part[]>(
    "parts", 
    () => partApi.getAll().then((res: any) => res.data)
  );

  const createMutation = useMutation(
    (data: Omit<Maintenance, "id" | "createdAt" | "updatedAt">) =>
      maintenanceApi.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("maintenances");
        message.success("Manutenção criada com sucesso");
        setMaintenanceModalOpen(false);
        form.resetFields();
      },
      onError: (error: any) => {
        message.error(`Erro ao criar manutenção: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Maintenance> }) =>
      maintenanceApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("maintenances");
        message.success("Manutenção atualizada com sucesso");
        setMaintenanceModalOpen(false);
        form.resetFields();
        setMaintenanceToEdit(null);
      },
      onError: (error: any) => {
        message.error(`Erro ao atualizar manutenção: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  const deleteMutation = useMutation(
    (id: string) => maintenanceApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("maintenances");
        message.success("Manutenção excluída com sucesso");
      },
      onError: (error: any) => {
        message.error(`Erro ao excluir manutenção: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  const updateStatusMutation = useMutation(
    ({ id, status }: { id: string; status: MaintenanceStatus }) =>
      maintenanceApi.updateStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("maintenances");
        message.success("Status atualizado com sucesso");
      },
      onError: (error: any) => {
        message.error(`Erro ao atualizar status: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  const filteredMaintenances = maintenances?.filter((maintenance: Maintenance) => {
    const titleMatch = maintenance.title
      .toLowerCase()
      .includes(filters.title.toLowerCase());
    const statusMatch = !filters.status || maintenance.status === filters.status;
    const partMatch = !filters.partId || maintenance.partId === filters.partId;
    return titleMatch && statusMatch && partMatch;
  });

  const handleFinish = (values: any) => {
    const formattedValues = {
      ...values,
      dueDate: values.dueDate?.toISOString(),
    };

    if (maintenanceToEdit) {
      updateMutation.mutate({
        id: maintenanceToEdit.id,
        data: formattedValues,
      });
    } else {
      createMutation.mutate(formattedValues);
    }
  };

  const handleEdit = (record: Maintenance) => {
    setMaintenanceToEdit(record);
    form.setFieldsValue({
      ...record,
      dueDate: record.dueDate ? dayjs(record.dueDate) : undefined,
    });
    setMaintenanceModalOpen(true);
  };

  const handleAdd = (date?: Date) => {
    setMaintenanceToEdit(null);
    
    if (date) {
      const initialValues = {
        dueDate: dayjs(date),
        status: MaintenanceStatus.SCHEDULED,
        frequency: MaintenanceFrequency.MONTHLY,
        referenceType: MaintenanceReferenceType.PART_INSTALLATION
      };
      
      setInitialFormValues(initialValues);
      
      form.setFieldsValue(initialValues);
    } else {
      setInitialFormValues(null);
      form.resetFields();
    }
    
    setMaintenanceModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Confirmação",
      content: "Tem certeza que deseja excluir esta manutenção?",
      okText: "Sim",
      cancelText: "Não",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleStatusChange = (id: string, status: MaintenanceStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusTag = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.SCHEDULED:
        return <Tag icon={<CalendarOutlined />} color="blue">Agendada</Tag>;
      case MaintenanceStatus.COMPLETED:
        return <Tag icon={<CheckCircleOutlined />} color="green">Concluída</Tag>;
      case MaintenanceStatus.OVERDUE:
        return <Tag icon={<ClockCircleOutlined />} color="red">Atrasada</Tag>;
      case MaintenanceStatus.CANCELED:
        return <Tag icon={<CloseCircleOutlined />} color="gray">Cancelada</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const columns: any = [
    {
      title: "Data Limite",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
      sorter: (a: Maintenance, b: Maintenance) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      sorter: (a: Maintenance, b: Maintenance) => a.title.localeCompare(b.title),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status as MaintenanceStatus),
      sorter: (a: Maintenance, b: Maintenance) => a.status.localeCompare(b.status),
    },
    {
      title: "Peça",
      dataIndex: "part",
      key: "part",
      render: (_: any, record: Maintenance) => {
        const partInfo = parts?.find((p: Part) => p.id === record.partId);
        return partInfo?.name || 'N/A';
      },
    },
    {
      title: "Equipamento",
      key: "equipment",
      render: (_: any, record: Maintenance) => {
        const part = parts?.find((p: Part) => p.id === record.partId);
        return part?.equipment?.name || 'N/A';
      },
    },
    {
      title: "Área",
      key: "area",
      render: (_: any, record: Maintenance) => {
        const part = parts?.find((p: Part) => p.id === record.partId);
        return part?.equipment?.area?.name || 'N/A';
      },
    },
    {
      title: "Planta",
      key: "plant",
      render: (_: any, record: Maintenance) => {
        const part = parts?.find((p: Part) => p.id === record.partId);
        return part?.equipment?.area?.plant?.name || 'N/A';
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: any, record: Maintenance) => (
        <Space size="small">
          {record.status === MaintenanceStatus.SCHEDULED && (
            <Tooltip title="Marcar como concluída">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusChange(record.id, MaintenanceStatus.COMPLETED)}
              />
            </Tooltip>
          )}
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tableFilters = [
    {
      key: "title",
      type: "text" as const,
      placeholder: "Filtrar por título",
    },
    {
      key: "status",
      type: "select" as const,
      placeholder: "Filtrar por status",
      options: [
        { label: "Todos", value: "" },
        { label: "Agendada", value: MaintenanceStatus.SCHEDULED },
        { label: "Concluída", value: MaintenanceStatus.COMPLETED },
        { label: "Atrasada", value: MaintenanceStatus.OVERDUE },
        { label: "Cancelada", value: MaintenanceStatus.CANCELED },
      ],
    },
    {
      key: "partId",
      type: "select" as const,
      placeholder: "Filtrar por peça",
      options: [
        { label: "Todas", value: "" },
        ...(parts?.map((part: Part) => ({
          label: part.name,
          value: part.id,
        })) || []),
      ],
    },
  ];

  const handleCreate = async (data: Omit<Maintenance, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createMutation.mutate(data);
      message.success('Manutenção criada com sucesso!');
      queryClient.invalidateQueries("maintenances");
    } catch (error) {
      console.error('Erro ao criar manutenção:', error);
      message.error('Erro ao criar manutenção. Por favor, tente novamente.');
    }
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Manutenções Preventivas</h2>
        <Space>
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle="solid">
            <Radio.Button value="table"><TableOutlined /> Tabela</Radio.Button>
            <Radio.Button value="calendar"><ScheduleOutlined /> Calendário</Radio.Button>
          </Radio.Group>
          {viewMode === "table" && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
              Nova Manutenção
            </Button>
          )}
        </Space>
      </div>
      
      <div style={{ position: 'relative' }}>
        <div 
          style={{
            position: viewMode === 'table' ? 'relative' : 'absolute',
            width: '100%',
            opacity: viewMode === 'table' ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: viewMode === 'table' ? 'auto' : 'none',
            zIndex: viewMode === 'table' ? 2 : 1
          }}
        >
          <DataTable
            title=""
            dataSource={filteredMaintenances || []}
            columns={columns}
            loading={maintenancesLoading || partsLoading}
            rowKey="id"
            filters={tableFilters}
            onFilterChange={setFilters}
            onAdd={() => handleAdd()}
            pagination={{ pageSize: 10 }}
          />
        </div>

        <div 
          style={{
            position: viewMode === 'calendar' ? 'relative' : 'absolute',
            width: '100%',
            opacity: viewMode === 'calendar' ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: viewMode === 'calendar' ? 'auto' : 'none',
            zIndex: viewMode === 'calendar' ? 2 : 1
          }}
        >
          
          <MaintenanceCalendar
            maintenances={filteredMaintenances || []}
            parts={parts || []}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
            onAdd={() => handleAdd()}
            onCreate={handleCreate}
          />
        </div>
      </div>

      <Modal
        title={maintenanceToEdit ? "Editar Manutenção" : "Nova Manutenção"}
        open={maintenanceModalOpen}
        onCancel={() => {
          setMaintenanceModalOpen(false);
          form.resetFields();
          setMaintenanceToEdit(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            status: MaintenanceStatus.SCHEDULED,
            frequency: MaintenanceFrequency.MONTHLY,
            referenceType: MaintenanceReferenceType.PART_INSTALLATION,
          }}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: "Por favor, informe o título" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Descrição">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="partId"
            label="Peça"
            rules={[{ required: true, message: "Por favor, selecione a peça" }]}
          >
            <Select
              showSearch
              placeholder="Selecione uma peça"
              optionFilterProp="children"
              loading={partsLoading}
            >
              {parts?.map((part: Part) => (
                <Select.Option key={part.id} value={part.id}>
                  {part.name} - {part.equipment?.name || 'N/A'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Data Limite"
            rules={[{ required: true, message: "Por favor, informe a data limite" }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Por favor, selecione o status" }]}
          >
            <Select>
              <Select.Option value={MaintenanceStatus.SCHEDULED}>Agendada</Select.Option>
              <Select.Option value={MaintenanceStatus.COMPLETED}>Concluída</Select.Option>
              <Select.Option value={MaintenanceStatus.OVERDUE}>Atrasada</Select.Option>
              <Select.Option value={MaintenanceStatus.CANCELED}>Cancelada</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="frequency"
            label="Frequência"
            rules={[{ required: true, message: "Por favor, selecione a frequência" }]}
          >
            <Select>
              <Select.Option value={MaintenanceFrequency.DAILY}>Diária</Select.Option>
              <Select.Option value={MaintenanceFrequency.WEEKLY}>Semanal</Select.Option>
              <Select.Option value={MaintenanceFrequency.MONTHLY}>Mensal</Select.Option>
              <Select.Option value={MaintenanceFrequency.QUARTERLY}>Trimestral</Select.Option>
              <Select.Option value={MaintenanceFrequency.SEMI_ANNUAL}>Semestral</Select.Option>
              <Select.Option value={MaintenanceFrequency.ANNUAL}>Anual</Select.Option>
              <Select.Option value={MaintenanceFrequency.CUSTOM}>Personalizada</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="customDays"
            label="Dias (para frequência personalizada)"
            dependencies={['frequency']}
            rules={[
              ({ getFieldValue }: { getFieldValue: (field: string) => any }) => ({
                validator(_: any, value: any) {
                  if (getFieldValue('frequency') !== MaintenanceFrequency.CUSTOM || value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Informe o número de dias para frequência personalizada'));
                },
              }),
            ]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            name="referenceType"
            label="Referência para cálculo"
            rules={[{ required: true, message: "Por favor, selecione o tipo de referência" }]}
          >
            <Select>
              <Select.Option value={MaintenanceReferenceType.PART_INSTALLATION}>Data de instalação da peça</Select.Option>
              <Select.Option value={MaintenanceReferenceType.EQUIPMENT_OPERATION}>Data de operação do equipamento</Select.Option>
              <Select.Option value={MaintenanceReferenceType.FIXED_DATE}>Data fixa</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMutation.isLoading || updateMutation.isLoading}>
                {maintenanceToEdit ? "Atualizar" : "Criar"}
              </Button>
              <Button onClick={() => {
                setMaintenanceModalOpen(false);
                form.resetFields();
                setMaintenanceToEdit(null);
              }}>
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
